export class EqualityCheckUtil {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static deepEqual(o1: any, o2: any): boolean {
    // function 'equals' copied from @ngx-translate/core/dist/lib/util
    if (o1 === o2) return true;
    if (o1 === null || o2 === null) return false;
    if (Number.isNaN(o1) && Number.isNaN(o2)) return true;
    const t1 = typeof o1,
      t2 = typeof o2;

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    let length: number, key: any, keySet: any;
    if (t1 === t2 && t1 === 'object') {
      if (Array.isArray(o1)) {
        if (!Array.isArray(o2)) return false;
        if ((length = o1.length) === o2.length) {
          for (key = 0; key < length; key++) {
            if (!this.deepEqual(o1[key], o2[key])) return false;
          }
          return true;
        }
      } else {
        if (Array.isArray(o2)) {
          return false;
        }
        keySet = Object.create(null);
        for (key in o1) {
          if (!this.deepEqual(o1[key], o2[key])) {
            return false;
          }
          keySet[key] = true;
        }
        for (key in o2) {
          if (!(key in keySet) && typeof o2[key] !== 'undefined') {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  }
}
