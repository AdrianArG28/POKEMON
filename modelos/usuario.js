const defineUsuario = (sequelize, DataTypes) => {
    return sequelize.define('Usuario', {
        cedula: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        edad: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        activo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }

    }, {
        tableName: 'usuario',
        timestamps: true
    });
};

module.exports = defineUsuario;