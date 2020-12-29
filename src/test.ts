export class Customer {
    private _model: any;
    public notifyChange: any;
    constructor() {
        this._model = {};
    }

    public get firstName() {
        return this._model.firstName;
    }
    public set firstName(value: string) {
        if (value !== this._model.firstName) {
            this._model.firstName = value;
            if (this.notifyChange) {
                this.notifyChange('firstName');
            }
        }
    }

    public get lastName() {
        return this._model.lastName;
    }
    public set lastName(value: string) {
        if (value !== this._model.lastName) {
            this._model.lastName = value;
            if (this.notifyChange) {
                this.notifyChange('lastName');
                this.readOnly = this._model.lastName === 'STOIE';
            }
        }

    }
    public get readOnly() {
        return this._model.readOnly;
    }
    public set readOnly(value: boolean) {
        if (value !== !!this._model.readOnly) {
            this._model.readOnly = value;
            if (this.notifyChange) {
                this.notifyChange('readOnly');
            }
        } else {
            this._model.readOnly = value;
        }

    }


}