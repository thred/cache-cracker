
export function onlyIf<Any>(test: any, fn: (test?: any) => Any): Any {
    if (test instanceof Function) {
        test = test();
    }

    return (test) ? fn(test) : null;
}