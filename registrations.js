module.exports = function Registration(pool) {
    let errors = ''
    let succs_message = ''
    async function addToList(param) {
        errors = ''
        let reg = param;
        let reg_numbers = await pool.query('SELECT * FROM my_reg_numbers WHERE reg_numbers = $1', [reg])
        if (reg_numbers.rows.length !== 0) {
            errors = 'license plate already exists'
            return true;
        }
        let id;
        let get_all_towns = await pool.query('SELECT * FROM towns;');
        if (get_all_towns.rows.length !== 0) {
            for (let i = 0; i < get_all_towns.rows.length; i++) {
                id = get_all_towns.rows[i].id;
                let tag = get_all_towns.rows[i].town_tag;
                if (param.startsWith(tag)) {
                    return await pool.query('INSERT INTO my_reg_numbers (reg_numbers,towns_id) VALUES ($1,$2)', [reg, id])
                }
            }
        }
        errors = 'Sorry we dont track license plate for that town!'
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
        if (allRegs === "all") {
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
        succs_message = 'Successfully reseted the database!'
        return reset;
    }
    const display_error = () => errors
    const display_succs = () => succs_message

    return {
        addToList,
        getRegistrations,
        add_town,
        theFilter,
        resetData,
        display_error,
        display_succs


    }
}