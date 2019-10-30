module.exports = function Registration(pool) {

    async function addToList(param) {
        let reg = param;
        console.log(reg);

        let reg_numbers = await pool.query('SELECT * FROM my_reg_numbers WHERE reg_numbers = $1', [reg])
        if (reg_numbers.rows.length !== 0) {
            return true;
        }

        let id;
        let get_all_towns = await pool.query('SELECT * FROM towns;');

        for (let x = 0; x < get_all_towns.rows.length; x++) {
            id = get_all_towns.rows[x].id;
            let tag = get_all_towns.rows[x].town_tag;
            if (param.startsWith(tag)) {
                await pool.query('INSERT INTO my_reg_numbers (reg_numbers,towns_id) VALUES ($1,$2)', [reg, id])
            }
        }

    }

    async function getRegistrations() {
        var regs = await pool.query('SELECT * FROM my_reg_numbers')
        console.log(regs.rows);
        
        return regs.rows;
    }

    //     error = "";
    //     if (regNumbers === "") {
    //         error = "reg can't be blank, Please enter a reg number!"
    //         return false;
    //     }


    //   if (!regNumbers.includes(param)) {
    //         regNumbers.push(param);
    //         return true;
    //     }else{
    //         error = "reg number already exists!"
    //     }


    // function theFilter(town) {

    //     var myfilter = [];
    //     regNumbers.forEach(element => {
    //         if (element.startsWith(town)) {
    //             myfilter.push(element)
    //         }
    //     });

    //     return myfilter;
    // }


    // function getErrorMessages() {
    //     return error;
    // }

    return {
        addToList,
        getRegistrations,
        // theFilter,
        // getErrorMessages

    }
}