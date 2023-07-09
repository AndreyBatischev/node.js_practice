import keys from '../keys/index.js'

const contentMail = (email) => {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Аккаунт создан',
        html: `
        <h1>Добро пожаловать</h1>
        <p>Вы успешно создали аккаунт с email ${email}</p>
        <hr />
        <a href="${keys.BASE_URL}">Магазин курсов</a>
        `
    }
}

export default contentMail