interface APIUser {
  user_id: number,
  provider: string,
  username: string,
  avatar_url: string,
  role: string,
  disabled: boolean,
  completed: boolean,
}

export default APIUser;