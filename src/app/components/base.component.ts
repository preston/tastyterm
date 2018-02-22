export abstract class BaseComponent {

    canMoveUp<T>(item: T, within: Array<T>): boolean {
        return within.indexOf(item) > 0;
    }

    canMoveDown<T>(item: T, within: Array<T>): boolean {
        return within.indexOf(item) < within.length - 1;
    }

    moveUp<T>(item: T, within: Array<T>): void {
        if (within.length > 1) {
            let i: number = within.indexOf(item, 0);
            if (i > 0) {
                let tmp: T = within[i - 1];
                within[i - 1] = within[i];
                within[i] = tmp;
            }

        }
    }

    moveDown<T>(item: T, within: Array<T>): void {
        if (within.length > 1) {
            let i: number = within.indexOf(item, 0);
            if (i < within.length - 1) {
                let tmp: T = within[i + 1];
                within[i + 1] = within[i];
                within[i] = tmp;
            }
        }
    }

}
