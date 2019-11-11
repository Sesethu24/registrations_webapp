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
    it('should return registration numbers from Cape Town only', async function () {
        let instanceForReg = Registrations(pool);
        await instanceForReg.add_town('Cape town','CA')
        await instanceForReg.addToList('CA 123 123');
        await instanceForReg.addToList('CY 123 234');
        let reg_numbers = await instanceForReg.theFilter('CA');
        assert.equal('CA 123 123', reg_numbers);
    });
    it('should return registration numbers from Bellville only', async function () {
        let instanceForReg = Registrations(pool);
        await instanceForReg.add_town('Bellville','CY')
        await instanceForReg.addToList('CA 123 123');
        await instanceForReg.addToList('CY 123 234');
        let reg_numbers = await instanceForReg.theFilter('CY');
        assert.equal('CY 123 234', reg_numbers);
    });
    it('should return registration numbers from Parrow only', async function () {
        let instanceForReg = Registrations(pool);
        await instanceForReg.add_town('Parrow','CJ')
        await instanceForReg.addToList('CJ 321 123');
        await instanceForReg.addToList('CY 123 234');
        let reg_numbers = await instanceForReg.theFilter('CJ');
        assert.equal('CJ 321 123', reg_numbers);
    });
    after(function () {
        pool.end();
    })
});