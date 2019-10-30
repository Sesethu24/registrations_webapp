module.exports = function(regs){

    async function index(req, res){
    var list = await regs.getRegistrations()
    res.render("index",{
        regnums: list
    })
    }
    
    async function addRegNumbers(req, res){
      let regnumber = req.body.plate;
      await regs.addToList(regnumber)
      res.redirect('/');
    }

     function checkForRegex(){

        var regex = /[A-Z]{2}\s[0-9]{6}/g;
        var newReg = regex.test(param)

        var regex = /([A-Z]){2}\s+([0-9]){3}\s([0-9]){3}/g;
        var newReg2 = regex.test(param)

        if (!newReg && !newReg2) {
            error = "please check the registrations examples above for valid registration numbers!";
            return false;
        }
     }
    return{
        index,
        checkForRegex,
        addRegNumbers
    }
}