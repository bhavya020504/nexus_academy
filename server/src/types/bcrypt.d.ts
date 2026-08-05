declare module 'bcrypt' {
  function hash(data: string, saltRounds: number): Promise<string>;
  function compare(data: string, encrypted: string): Promise<boolean>;
  function hashSync(data: string, saltRounds: number): string;

  export { hash, compare, hashSync };
  export default { hash, compare, hashSync };
}
