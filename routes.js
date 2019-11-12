module.exports = function (regs) {

    async function index(req, res) {
        var list = await regs.getRegistrations()


        res.render("index", {
            regnums: list
        })
    }
    async function addRegNumbers(req, res) {
        let regnumber = req.body.plate;
        let myRegex = checkForRegex(regnumber)
        if (regnumber === "") {
            req.flash("message", "reg can't be blank, Please enter a reg number!")
            return res.redirect('/')
        }
        if (myRegex) {
            req.flash("message", "INVALID! a valid reg starts with CA, CY or CJ a space and numbers");
            return res.redirect('/')
        } 
        else if (myRegex === false) {
            req.flash("message", "INVALID town tag! a valid reg starts with CA, CY or CJ ");
        }
        await regs.addToList(regnumber)
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

        var regex = /([A-Z]){2}\s+([0-9]){3}\s([0-9]){3}/g;
        var newReg2 = regex.test(param)
        return !newReg && !newReg2

    }
    async function clearButton(req, res) {
        await regs.resetData()
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