class initShader{
    public static getShader(shaderStr: string, type: shaderType) {
        if (type === shaderType.vertex) {
            let result = shaderStr.replace(/[\s\S]*\/\/vertex([\s\S\n]*)\/\/vertex end[\s\S]*/, "$1");
            return result;
        }
        if (type === shaderType.fragment) {
            let result = shaderStr.replace(/[\s\S]*\/\/fragment([\s\S\n]*)\/\/fragment end[\s\S]*/, "$1");
            return result;
        }
        return "";
    }
}
enum shaderType{
    vertex,
    fragment
};

export {initShader, shaderType};
