const generarId = () => {
    const random = Math.random().toString(32).substring(6);
    const date = Date.now().toString(32).substring(6);
    let id = random + date;
    const min = 10;
    if (id.length < min) {
        const relleno = '4'.repeat(min - id.length);
        id = relleno + id;
    }
    return id;
}

export default generarId
