const definePokemon = (sequelize, DataTypes) => {
    return sequelize.define('Pokemon', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true 
        },
        pokeApiId: { 
            type: DataTypes.INTEGER,
            allowNull: true,
            unique: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tipo: {
            type: DataTypes.STRING,
            allowNull: false
        },        
        poder: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'pokemon',
        timestamps: true
    });
};

module.exports = definePokemon;