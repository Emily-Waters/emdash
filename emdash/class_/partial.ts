import { ClassType } from "../types/class";

export function PartialClass<
  TClassType extends ClassType,
  TClassKey extends keyof InstanceType<TClassType>
>(Base: TClassType, ...keys: TClassKey[]): ClassType<Pick<InstanceType<TClassType>, TClassKey>> {
  return class extends Base {
    constructor(...args: any[]) {
      super(...args);

      const allowedKeys = new Set(keys);

      Object.getOwnPropertyNames(this).forEach((prop) => {
        if (!allowedKeys.has(prop as TClassKey) && prop !== "constructor") {
          delete this[prop];
        }
      });
    }
  };
}
