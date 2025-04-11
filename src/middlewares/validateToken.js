import ts from '../utils/tokenServices.js'
const Validate = async(req,res,next)=>{
    try {
        let token = req?.headers?.authorization?.split(" ")[1]

        if(token)
        {
            let payload = await ts.verifyToken(token)
            next()
        }
        else
        {
            res.status(402).send({
                message:"Token Not Found"
            })
        }
        
    } catch (error) {
        if(error.message === 'jwt expired'){
            res.status(402).send({
                message : "Plese LogIn!"
            });
        }else{
            res.status(500).send({
                message : "Internal Server Error"
            });
        }
       
    }
}

export default Validate