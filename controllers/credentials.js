const models = require('../models')

const saveCredentials = async (authId, credential, dataSourceType, emailId) => {
    let cret = await models.sequelize.query(
        'select * from credentials where authId = ?',
        {
            replacements: [authId],
            type: models.sequelize.QueryTypes.SELECT
        }
    )
    console.log(cret)
    if (cret.length == 1) {
        console.log("cret 1")
        cret = await models.sequelize.query(
            'update credentials set credentials = ? where authId = ?',
            {
                replacements: [credential, authId],
                type: models.sequelize.QueryTypes.UPDATE
            }
        )
        console.log('Credentials updated')
        return 'Credentials updated'
    }
    else if (cret.length == 0) {
        console.log("cret 2 : ", emailId)
        cret = await models.sequelize.query('insert into credentials ( dataSourceType , credentials ,authId,emailId) values (?,?,?,?)', {
            replacements: [dataSourceType, credential, authId, emailId],
            type: models.sequelize.QueryTypes.INSERT,
            model: models.credential
        })
        console.log('Credentials created')
        return 'Credentials created'
    }

}

const getCredentials = async (authId) => {

    const data = await models.sequelize.query(
        'select credentials from credentials where authId = ?',
        {
            replacements: [authId],
            type: models.sequelize.QueryTypes.SELECT
        }
    )
    // console.log(data[0])
    let cret = data[0]

    return cret;
}

const getEmail = async (authId) => {
    const data = await models.sequelize.query(
        'select emailId from credentials where authId = ?',
        {
            replacements: [authId],
            type: models.sequelize.QueryTypes.SELECT
        }
    )
    let cret = data[0]
    return cret.emailId
}

module.exports = { saveCredentials, getCredentials, getEmail }
