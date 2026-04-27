import { axios, unpack } from '@/lib/axios';
import { restApi } from '@/lib/rest';
import { LiveEvent, LiveMessage, LiveRoom, User, UserGroup } from '@/service/model';
import { DataParams, DataResult } from '@winglab/react-table';

/**
 * 登录
 * @param data
 */
export async function login(data: unknown) {
  await axios.get('/api/csrf-cookie');
  return unpack<User>(axios.post('/api/login', data));
}

/**
 * 退出账号
 */
export async function logout() {
  return unpack(axios.post('/api/logout'));
}

/**
 * 获取用户信息
 */
export async function profileShow() {
  return unpack<User>(axios.get('/api/profile'));
}

/**
 * 更新用户信息
 * @param data
 */
export async function profileUpdate(data: unknown) {
  return unpack<User>(axios.post('/api/profile', data));
}

/**
 * 更新密码
 * @param data
 */
export async function passwordUpdate(data: unknown) {
  return unpack<User>(axios.post('/api/password', data));
}

/**
 * 前台观看：直播间列表
 */
export async function roomsIndex() {
  return unpack<LiveRoom[]>(axios.get('/api/rooms'));
}

/**
 * 前台观看：直播间信息
 * @param roomId
 */
export async function roomsShow(roomId: string) {
  return unpack<LiveRoom>(axios.get(`/api/rooms/${roomId}`));
}

/**
 * 前台观看：直播回放
 * @param roomId
 */
export async function eventsIndex(roomId: string) {
  return unpack<LiveEvent[]>(axios.get(`/api/rooms/${roomId}/events`));
}

/**
 * 前台观看：回放信息
 * @param eventId
 */
export async function eventsShow(eventId: string) {
  return unpack<LiveEvent>(axios.get(`/api/events/${eventId}`));
}

/**
 * 前台观看：评论列表
 * @param eventId
 */
export async function messagesIndex(eventId: string) {
  return unpack<LiveMessage[]>(axios.get(`/api/events/${eventId}/messages`));
}

/**
 * 前台观看：发布评论
 * @param eventId
 * @param content
 */
export async function messagesStore(eventId: string, content: string) {
  return unpack<LiveMessage>(axios.post(`/api/events/${eventId}/messages`, { content }));
}

/**
 * 管理后台接口
 */
export const audienceUsersApi = restApi<User>('/api/settings/users', true);

/**
 * 管理后台：分组选项
 */
export async function settingsGroupsOptions() {
  return unpack<UserGroup[]>(axios.get('/api/settings/groups'));
}

/**
 * 管理后台：新建分组
 * @param data
 */
export async function settingsGroupsStore(data?: Partial<UserGroup>) {
  return unpack<UserGroup>(axios.post('/api/settings/groups', data));
}

/**
 * 管理后台：修改分组
 * @param groupId
 * @param data
 */
export async function settingsGroupsUpdate(groupId: string, data?: Partial<UserGroup>) {
  return unpack<UserGroup>(axios.put('/api/settings/groups/' + groupId, data));
}

/**
 * 管理后台：删除分组
 * @param groupId
 */
export async function settingsGroupsDestroy(groupId: string) {
  return unpack<undefined>(axios.delete('/api/settings/groups/' + groupId));
}

/**
 * 管理后台：直播间列表
 */
export async function settingsRoomsIndex(params?: DataParams) {
  return unpack<DataResult<LiveRoom>>(axios.get('/api/settings/rooms', { params }));
}

/**
 * 管理后台：直播间选项
 */
export async function settingsRoomsOptions() {
  return unpack<LiveRoom[]>(axios.get('/api/settings/rooms/options'));
}

/**
 * 管理后台：新建直播间
 */
export async function settingsRoomsStore(data?: Partial<LiveRoom>) {
  return unpack<LiveRoom>(axios.post('/api/settings/rooms', data));
}

/**
 * 管理后台：直播间详情
 */
export async function settingsRoomsShow(roomId: string) {
  return unpack<LiveRoom>(axios.get('/api/settings/rooms/' + roomId));
}

/**
 * 管理后台：修改直播间
 */
export async function settingsRoomsUpdate(roomId: string, data?: Partial<LiveRoom>) {
  return unpack<LiveRoom>(axios.put('/api/settings/rooms/' + roomId, data));
}

/**
 * 管理后台：修改直播间封面
 */
export async function settingsRoomsCover(roomId: string, data?: Partial<LiveRoom>) {
  return unpack<LiveRoom>(axios.put('/api/settings/rooms/' + roomId + '/cover', data));
}

/**
 * 管理后台：修改直播间分组
 */
export async function settingsRoomsGroups(roomId: string, data?: Partial<LiveRoom>) {
  return unpack<LiveRoom>(axios.put('/api/settings/rooms/' + roomId + '/group', data));
}

/**
 * 管理后台：删除直播间
 */
export async function settingsRoomsDestroy(roomId: string) {
  return unpack<undefined>(axios.delete('/api/settings/rooms/' + roomId));
}

/**
 * 管理员列表
 * @param params
 */
export async function settingsAdminsIndex(params?: DataParams) {
  return unpack<DataResult<User>>(axios.get('/api/systems/users', { params }));
}

/**
 * 管理员详情
 * @param userId
 */
export async function settingsAdminsShow(userId: string) {
  return unpack<User>(axios.get('/api/systems/users/' + userId));
}

/**
 * 新建管理员
 * @param data
 */
export async function settingsAdminsStore(data?: Partial<User>) {
  return unpack<User>(axios.post('/api/systems/users', data));
}

/**
 * 修改管理员
 * @param userId
 * @param data
 */
export async function settingsAdminsUpdate(userId: string, data?: Partial<User>) {
  return unpack<User>(axios.put('/api/systems/users/' + userId, data));
}

/**
 * 删除管理员
 * @param userId
 */
export async function settingsAdminsDestroy(userId: string) {
  return unpack<undefined>(axios.delete('/api/systems/users/' + userId));
}

/**
 * 修改管理员授权
 * @param userId
 * @param data
 */
export async function settingsAdminsManageable(userId: string, data?: Partial<User>) {
  return unpack<User>(axios.put('/api/systems/users/' + userId + '/manageable', data));
}
