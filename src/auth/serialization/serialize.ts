import { APIUser } from '../interfaces'

const serialize = (user: APIUser, done: (err: any, id?: any) => void) => done(null, user.user_id);

export default serialize;