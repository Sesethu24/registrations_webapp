const assert = require('assert');
const Registrations = require('../registrations');
const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://sethu:codex123@localhost:5432/reg_numbers_tests';

const pool = new Pool({
    connectionString
});

describe('The basic database web app', function () {

    beforeEach(async function () {
        await pool.query("delete from my_reg_numbers;");
        await pool.query("delete from towns;");
    });

    it('should be able to add a registration number', async function () {
        let instanceForReg = Registrations(pool);
        await instanceForReg.add_town('Cape town','CA')
        await instanceForReg.addToList('CA 123 123');
        let reg_numbers = await instanceForReg.getRegistrations();
        assert.equal(1, reg_numbers.length);
    });

    it('should not add a registration number if it already exists in the database', async function () {
        let instanceForReg = Registrations(pool);
        await instanceForReg.add_town('Cape town','CA')
        await instanceForReg.addToList('CA 123 123');
        await instanceForReg.addToList('CA 123 123');
        let reg_numbers = await instanceForReg.getRegistrations();
        assert.equal(1, reg_numbers.length);
    });

    after(function () {
        pool.end();
    })
});