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

    describe("RegEx test", function () {
        var regex = /[A-Z]{2}\s[0-9]{6}/g;
        it("should return true ", function () {
            var name = "CA 123456"
            assert.equal(regex.test(name), true)
    
        })
        
         it("should check if the reg number matches the regex, meaning that it has at least 2 characters a space and 6 digits ", function ()  {
            var regex = /[A-Z]{2}\s[0-9]{6}/g;
            var name = "CA 123456"
                assert.equal(regex.test(name), true)
        
            })
        it("should return false", function () {
            var name = ".."
    
            assert.equal(regex.test(name), false)
        })
        it("should return false if the reg numbers dont match the regex ", function () {
            var name = "CA12345"
    
            assert.equal(regex.test(name), false)
        })
    })
    
    after(function () {
        pool.end();
    })
});