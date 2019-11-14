module.exports = function (regs) {

    async function index(req, res) {
        var list = await regs.getRegistrations()


        res.render("index", {
            regnums: list
        })
    }
    async function addRegNumbers(req, res) {
        let regnumber = req.body.plate;
        var regex_1 = /[A-Z]{2}\s[0-9]{6}/g;
        var regex_2 = /([A-Z]){2}\s+([0-9]){3}\s([0-9]){3}/g;
        let new_reg = regex_1.test(regnumber)
        let new_reg_2 = regex_2.test(regnumber)
        if (regnumber === "") {
            req.flash("message", "reg can't be blank, Please enter a reg number!")
            return res.redirect('/')
        }

        if (new_reg === true || new_reg_2 === true) {


            await regs.addToList(regnumber)

        } else {
            req.flash("message", "INVALID! a valid reg starts with CA, CY or CJ a space and numbers");
            return res.redirect('/')
        }

        if (regs.display_error()) {
            req.flash('message', regs.display_error())
            return res.redirect('/')
        }

        res.redirect('/');
    }

    async function filteredRegs(req, res) {
        let myregs = req.body.town;
        let regnums = await regs.theFilter(myregs)


        res.render('index', {
            regnums
        })
    }

    function checkForRegex(param) {

        var regex = /[A-Z]{2}\s[0-9]{6}/g;
        var newReg = regex.test(param)



        var newReg2 = regex.test(param)
        return !newReg && !newReg2

    }
    async function clearButton(req, res) {
        await regs.resetData()
        req.flash('message', regs.display_succs())
        res.redirect('/')
    }

    return {
        index,
        checkForRegex,
        addRegNumbers,
        clearButton,
        filteredRegs
    }
}