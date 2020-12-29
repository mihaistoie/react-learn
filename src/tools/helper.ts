
export class Helper {
    public static id(): string {
        return 'ID_' + Math.random().toString(36).substr(2, 9);
    }
    public static extractVariables(expression: string): string[] {
        const res: string[] = [];
        expression.replace(/\{\{([^{]*)\}\}/g, function (match, p) {
            res.push(p.trim());
            return '';
        });
        return res;
    }
    public static normalizeProperty(property: string): string {
        return property;
    }
    public static execExpression(expression: string, context: any): string {
        return expression.replace(/\{\{([^{]*)\}\}/g, function (match, p) {
            const propName = p.trim();
            // TOODO
            const value = context[propName];
            return value;
        });
    }
}

