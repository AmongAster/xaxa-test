import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { User } from './users.model';
import { Role, RoleName } from '../roles/role.model';

export interface KeycloakProfile {
  sub: string;
  email?: string;
  name?: string;
  preferred_username?: string;
}
 
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Role) private roleModel: typeof Role,
  ) {}
 
  findAll(): Promise<User[]> {
    return this.userModel.findAll({ include: [Role] });
  }
 
  async findById(id: number): Promise<User> {
    const user = await this.userModel.findByPk(id, { include: [Role] });
    if (!user) {
      throw new NotFoundException(`Пользователь #${id} не найден`);
    }
    return user;
  }
 
  findByKeycloakId(keycloakId: string): Promise<User | null> {
    return this.userModel.findOne({ where: { keycloakId }, include: [Role] });
  }
 
  create(dto: CreateUserDto): Promise<User> {
    return this.userModel.create(dto as User);
  }
 
  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    return user.update(dto);
  }
 
  async remove(id: number): Promise<void> {
    const user = await this.findById(id);
    await user.destroy();
  }
 
  /**
   * Авто-провижининг: вызывается из KeycloakStrategy.validate() на КАЖДОМ
   * запросе. Если юзер с таким keycloakId уже есть - просто отдаём его
   * (обычный случай, БД - источник истины по ролям и managerUserId).
   * Если это первый логин человека, который уже существует в Keycloak, но
   * ещё не заведён у нас - создаём с ролью USER по умолчанию, а не 401.
   *
   * ⚠️ Осознанное решение: новый юзер сразу активен (isActive: true) и
   * получает минимальную роль USER. Если вместо этого нужен режим "ждёт
   * подтверждения администратора" - создавайте с isActive: false и
   * добавьте отдельный эндпоинт активации для ADMIN. Сейчас сделано проще.
   */
  async findOrCreateFromKeycloak(profile: KeycloakProfile): Promise<User> {
    const existing = await this.findByKeycloakId(profile.sub);
    if (existing) {
      return existing;
    }
 
    const defaultRole = await this.roleModel.findOne({ where: { name: RoleName.USER } });
    if (!defaultRole) {
      // Реальная причина этой ошибки почти всегда одна: не прогнана
      // миграция 0012-seed-roles.js (таблица roles физически пустая).
      throw new InternalServerErrorException(
        'Роль USER не найдена в БД — проверьте, что миграция 0012-seed-roles.js применена',
      );
    }
 
    if (!profile.email) {
      // email в модели User обязателен и уникален (allowNull: false, unique: true).
      // Если в Keycloak-клиенте не подключён scope "email" или у юзера не
      // заполнена почта - claim придёт пустым, и bulk-insert упадёт с
      // constraint-ошибкой. Проверяем здесь и даём понятное сообщение
      // вместо сырого 500 от Sequelize.
      throw new InternalServerErrorException(
        'В токене Keycloak отсутствует email — добавьте маппер "email" в клиенте Keycloak',
      );
    }
 
    const created = await this.userModel.create({
      keycloakId: profile.sub,
      email: profile.email,
      fullName: profile.name ?? profile.preferred_username ?? profile.email,
      roleId: defaultRole.id,
      isActive: true,
    } as User);
 
    // findByKeycloakId сделал бы отдельный SELECT ради include:[Role] —
    // проще присвоить уже загруженный defaultRole напрямую.
    created.role = defaultRole;
    return created;
  }
 
  /**
   * Возвращает список ID пользователей, чьи ВУЗы видны текущему юзеру:
   * - ADMIN: null означает "без ограничений" (CatalogsService не добавит WHERE)
   * - MANAGER: сам + все subordinates (по managerUserId)
   * - USER: только сам
   * Используется в CatalogsModule для построения WHERE managerId IN (...).
   */
  async getVisibleManagerIds(currentUser: User): Promise<number[] | null> {
    if (currentUser.role?.name === 'ADMIN') {
      return null;
    }
    if (currentUser.role?.name === 'MANAGER') {
      const subordinates = await this.userModel.findAll({
        where: { managerUserId: currentUser.id },
        attributes: ['id'],
      });
      return [currentUser.id, ...subordinates.map((s) => s.id)];
    }
    return [currentUser.id];
  }
 
  findManyByIds(ids: number[]): Promise<User[]> {
    return this.userModel.findAll({ where: { id: { [Op.in]: ids } } });
  }
}