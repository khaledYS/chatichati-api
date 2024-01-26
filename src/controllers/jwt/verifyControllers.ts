import { dbType } from "../../routes/profile";
import { verifyJWT } from "../../utilities/generateJWTtoken";
import { validate } from "../../utilities/validate";

export async function verifyJwtController(req: any, res: any){
    const {jwt, email, username} = req.body;
    const {db}:dbType = req.app;

    //check from the provided inputs
    const validateRes = validate({email, username});
    if(!validateRes.ok || !jwt){
        return res.status(400).json({ message: !validateRes.ok ? validateRes.message : "Must provide Jwt."})
    }

    // verifying jwt
    const verifyJwtRes = verifyJWT(jwt);
    if(!verifyJwtRes.ok){
        if(verifyJwtRes.message == "JsonWebTokenError") return res.status(400).json({message: "Error with the provided jwt"})
        else if(verifyJwtRes.message == "TokenExpiredError") return res.status(410).json({message: "The provided jwt is expired"})
        else res.status(500).json({message: "Your jwt wasn't accepted, however the error is unknown."})
    }

    return res.status(200).json({message: verifyJwtRes.message})

}