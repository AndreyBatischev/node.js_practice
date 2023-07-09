import keys from '../keys/index.js'


const resetPassword = (email, token) => {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Password recovery',
        html: `
        <h1>Вы забыли пароль</h1>
        <p>Если нет, то проигнорируйте это письмо</p>
        <p>Иначе нажмите на ссылку для востановления доступа к сайту </p>
        <p><a href="${keys.BASE_URL}/auth/password/${token}">Восстановление доступа</a></p>
        <hr />
        <a href="${keys.BASE_URL}">Магазин курсов</a>
        `
    }
}


export default resetPassword