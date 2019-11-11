module.exports = function Registration(pool) {

    async function addToList(param) {
        let reg = param;

        let reg_numbers = await pool.query('SELECT * FROM my_reg_numbers WHERE reg_numbers = $1', [reg])
        if (reg_numbers.rows.length !== 0) {
            return true;
        }

        let id;
        let get_all_towns = await pool.query('SELECT * FROM towns;');

        for (let i = 0; i < get_all_towns.rows.length; i++) {
            id = get_all_towns.rows[i].id;
            let tag = get_all_towns.rows[i].town_tag;
            if (param.startsWith(tag)) {
                await pool.query('INSERT INTO my_reg_numbers (reg_numbers,towns_id) VALUES ($1,$2)', [reg, id])
            }
        }

    }
    async function getRegistrations() {
        var regs = await pool.query('SELECT * FROM my_reg_numbers')
        return regs.rows;
    }

    async function add_town(town, tag) {
        let build_town = await pool.query('INSERT INTO towns (town, town_tag) VALUES ($1,$2)', [town, tag])
        return build_town;
    }

    async function theFilter(town) {

        let allRegs = town
        let filteredTowns = []
        let regsFiltered = getRegistrations()
        if(allRegs === "all"){
           return regsFiltered;
        }

        regsFiltered = await pool.query('SELECT my_reg_numbers.reg_numbers, towns.town_tag FROM my_reg_numbers INNER JOIN towns ON my_reg_numbers.towns_id = towns.id;')
        regsFiltered = regsFiltered.rows
       
        for (let i = 0; i < regsFiltered.length; i++) {
        
            if (regsFiltered[i].town_tag === town) {
                filteredTowns.push(regsFiltered[i].reg_numbers)
            }
      }
        return filteredTowns;
    }
    async function resetData() {
        let reset = await pool.query("DELETE FROM my_reg_numbers;")
        return reset;
    }

    return {
        addToList,
        getRegistrations,
        add_town,
        theFilter,
        resetData


    }
}