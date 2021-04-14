export function productionOnly<T>(decoratorArgs?: {
  message?: string;
  returns?: T;
  returnPromise?: T;
  returnFunc?: (...args: any[]) => T;
}) {
  return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
    const func = descriptor.value;
    descriptor.value = function (...args: any[]) {
      if (process.env.NODE_ENV !== "production") {
        if (decoratorArgs?.message) alert(decoratorArgs.message);
        if (decoratorArgs?.returnFunc) return decoratorArgs.returnFunc(...args);
        else if (decoratorArgs?.returnPromise)
          return new Promise<T>((resolve) => resolve(decoratorArgs.returnPromise!));
        else return decoratorArgs?.returns ?? null;
      } else return func.apply(this, args);
    };
  };
}

// export function productionOnly(
//   target: Object,
//   propertyKey: string,
//   descriptor: PropertyDescriptor
// ) {
//   const func = descriptor.value;
//   descriptor.value = function (...args: any[]) {
//     if (process.env.NODE_ENV !== "production") {
//       return null;
//     } else return func.apply(this, args);
//   };
// }
