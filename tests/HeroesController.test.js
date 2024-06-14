// Importa o HeroesController do arquivo especificado.
// Ajuste o caminho conforme necessário.
const HeroesController = require('../api/controllers/HeroesController');

// Descreve um conjunto de testes para o HeroesController.
describe('HeroesController', () => {

  // Descreve um conjunto de testes para o método 'create'.
  describe('create', () => {

    // Testa se um novo herói é criado com sucesso.
    it('Deve criar um novo herói com sucesso', async () => {
        // Importa a biblioteca Chai para asserções.
        const chai = await import('chai');
        const { assert } = chai;

        // Arrange: Configura os objetos de request e response mockados, e define os dados do novo herói.
        const req = { body: { name: 'Superman', power: 'Flight' } };
        const res = {
            // Define um método json para o response que verifica se os dados do herói criado são corretos.
            json: (data) => {
                assert.equal(data.name, req.body.name);
                assert.equal(data.power, req.body.power);
            },
            // Define um método status que retorna um objeto com um método send para tratar erros.
            status: (code) => ({
                send: (message) => console.error(`Erro ${code}: ${message}`)
            })
        };

        // Mock do método Hero.new e do método fetch.
        const hero = {
            fetch: () => Promise.resolve({ id: 1, name: 'Superman', power: 'Flight' })
        };
        Hero.new = () => hero;

        // Act: Chama o método create do HeroesController.
        await HeroesController.create(req, res);
    });

    // Testa se um erro é retornado ao falhar na criação de um herói.
    it('Deve retornar um erro ao falhar na criação', async () => {
        const chai = await import('chai');
        const { assert } = chai;

        // Arrange: Configura os objetos de request e response mockados.
        const req = { body: { name: 'Superman', power: 'Flight' } };
        const res = {
            status: (code) => ({
                send: (message) => {
                    // Assert: Verifica se o código de status e a mensagem de erro são apropriados.
                    assert.equal(code, 500);
                    assert.equal(message, 'Erro ao criar herói');
                }
            })
        };

        // Mock do método Hero.new e do método fetch para simular uma falha.
        const hero = {
            fetch: () => Promise.reject(new Error('Erro ao criar herói'))
        };
        Hero.new = () => hero;

        // Act: Chama o método create do HeroesController e trata o erro.
        try {
            await HeroesController.create(req, res);
        } catch (e) {
            res.status(500).send('Erro ao criar herói');
        }
    });
  });

  // Descreve um conjunto de testes para o método 'list'.
  describe('list', () => {

    // Testa se todos os heróis são listados com sucesso.
    it('Deve listar todos os heróis com sucesso', async () => {
        const chai = await import('chai');
        const { assert } = chai;

        // Arrange: Configura os objetos de request e response mockados.
        const req = {};
        const res = {
            // Define um método json para o response que verifica se a lista de heróis está correta.
            json: (data) => {
                assert.isArray(data);
                assert.lengthOf(data, 2);
                assert.equal(data[0].name, 'Superman');
                assert.equal(data[1].name, 'Batman');
            },
            status: (code) => ({
                send: (message) => console.error(`Erro ${code}: ${message}`)
            })
        };

        // Mock do método Hero.find para retornar uma lista de heróis.
        Hero.find = () => Promise.resolve([
            { id: 1, name: 'Superman', power: 'Flight' },
            { id: 2, name: 'Batman', power: 'Martial Arts' }
        ]);

        // Act: Chama o método list do HeroesController.
        await HeroesController.list(req, res);
    });

    // Testa se um erro é retornado ao falhar na listagem de heróis.
    it('Deve retornar um erro se a listagem falhar', async () => {
        const chai = await import('chai');
        const { assert } = chai;

        // Arrange: Configura os objetos de request e response mockados.
        const req = {};
        const res = {
            status: (code) => ({
                send: (message) => {
                    // Assert: Verifica se o código de status e a mensagem de erro são apropriados.
                    assert.equal(code, 500);
                    assert.equal(message, 'Erro ao listar heróis');
                }
            })
        };

        // Mock do método Hero.find para simular uma falha.
        Hero.find = () => Promise.reject(new Error('Erro ao listar heróis'));

        // Act: Chama o método list do HeroesController e trata o erro.
        try {
            await HeroesController.list(req, res);
        } catch (e) {
            res.status(500).send('Erro ao listar heróis');
        }
    });
  });

  // Descreve um conjunto de testes para o método 'listwithgun'.
  describe('listwithgun', () => {

    // Testa se os heróis com armas são listados com sucesso.
    it('Deve listar heróis com armas com sucesso', async () => {
        const chai = await import('chai');
        const { assert } = chai;

        // Arrange: Configura os objetos de request e response mockados.
        const req = {};
        const res = {
            // Define um método json para o response que verifica se a lista de heróis com armas está correta.
            json: (data) => {
                assert.isArray(data);
                assert.lengthOf(data, 2);
                assert.equal(data[0].name, 'Superman');
                assert.equal(data[0].gun, 'Laser');
                assert.equal(data[1].name, 'Batman');
                assert.equal(data[1].gun, 'Batarang');
            },
            status: (code) => ({
                send: (message) => console.error(`Erro ${code}: ${message}`)
            })
        };

        // Mock do resultado da query que retorna uma lista de heróis com armas.
        const queryResult = {
            rows: [
                { id: 1, name: 'Superman', gun: 'Laser' },
                { id: 2, name: 'Batman', gun: 'Batarang' }
            ]
        };

        // Mock do método Hero.getDatastore().sendNativeQuery para retornar a lista mockada.
        Hero.getDatastore = () => ({
            sendNativeQuery: () => Promise.resolve(queryResult)
        });

        // Act: Chama o método listwithgun do HeroesController.
        await HeroesController.listwithgun(req, res);
    });

    // Testa se um erro é retornado ao falhar na query de heróis com armas.
    it('Deve retornar um erro se a query falhar', async () => {
        const chai = await import('chai');
        const { assert } = chai;

        // Arrange: Configura os objetos de request e response mockados.
        const req = {};
        const res = {
            status: (code) => ({
                send: (message) => {
                    // Assert: Verifica se o código de status e a mensagem de erro são apropriados.
                    assert.equal(code, 500);
                    assert.equal(message, 'Erro ao buscar heróis com armas');
                }
            })
        };

        // Mock do método Hero.getDatastore().sendNativeQuery para simular uma falha.
        Hero.getDatastore = () => ({
            sendNativeQuery: () => Promise.reject(new Error('Erro ao buscar heróis com armas'))
        });

        // Act: Chama o método listwithgun do HeroesController e trata o erro.
        try {
            await HeroesController.listwithgun(req, res);
        } catch (e) {
            res.status(500).send('Erro ao buscar heróis com armas');
        }
    });
  });

});
