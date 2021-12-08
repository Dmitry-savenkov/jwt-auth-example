import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { Arg, Query, Resolver, Mutation, ObjectType, Field } from "type-graphql";
import { User } from "./entity/User";

@ObjectType()
class LoginResponse{
  @Field()
  accessToken: string
}

@Resolver()
export class UserResolver{
  @Query(() => String)
    hello(){
      return 'his'
  }
  @Query(() => [User])
    users(){
      return User.find()
  }

  @Mutation(() => LoginResponse)
  async login( 
      @Arg('email') email : string,
      @Arg('password') password : string
    ) : Promise<LoginResponse>{

    const user = await User.findOne({
      where:{
        email
      }
    })

    if(!user){
      throw new Error("could not find user")
    }
    const valid = compare (password, user.password);

    if(!valid){
      throw new Error("bad password")
    }

    // login good
    
    return {
      accessToken: sign({userId: user.id,}, 'asdasdasdmasmd.a,smf.nsdfnsjfnjsndfjwei131323', {
        expiresIn: "15m"
      })
    }

  }

  @Mutation(() => Boolean)
  async register( 
      @Arg('email') email : string,
      @Arg('password') password : string
    ) : Promise<Boolean> {

    const hashedPassword = await hash(password, 12);

    try{
      await User.insert({
        email,
        password: hashedPassword
      }) 
    } catch(err){
      console.log(err)
      return false
    }
    return true
  }
}
