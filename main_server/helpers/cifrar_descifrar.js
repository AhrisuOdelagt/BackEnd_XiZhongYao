import crypto from "crypto"

const cifrar = (data) => {
    // Inicializamos datos iniciales
    const cipherKey = process.env.CIPHER_KEY;
    const cipherIV = process.env.CIPHER_IV;
    const cipherAlgorithm = process.env.CIPHER_ALGORITHM;
    // Ciframos
    const cipher = crypto.createCipheriv(cipherAlgorithm, Buffer.from(cipherKey, "hex"), Buffer.from(cipherIV, "hex"));
    let encrypted = cipher.update(data, "utf-8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
};

const descifrar = (cifra) => {
    // Inicializamos datos iniciales
    const cipherKey = process.env.CIPHER_KEY;
    const cipherIV = process.env.CIPHER_IV;
    const cipherAlgorithm = process.env.CIPHER_ALGORITHM;
    // Desciframos
    const decipher = crypto.createDecipheriv(cipherAlgorithm, Buffer.from(cipherKey, "hex"), Buffer.from(cipherIV, "hex"));
    let decrypted = decipher.update(cifra, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
}

export {
    cifrar,
    descifrar
};
