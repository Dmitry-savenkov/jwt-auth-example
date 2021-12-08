import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { Arg, Query, Resolver, Mutation, ObjectType, Field, Ctx } from "type-graphql";
import { User } from "./entity/User";
import { MyContext } from './MyContext';

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
      @Arg('password') password : string,
      @Ctx() { res }: MyContext
    ) : Promise<LoginResponse>{

    const user = await User.findOne({
      where:{
        email
      }
    })

    if(!user){
      throw new Error("could not find user")
    }
    const valid = await compare(password, user.password);

    if(!valid){
      throw new Error("bad password")
    }

    // login good

    res.cookie(
      'jid',
       sign({userId: user.id,}, 'kkqjenqkjncskjhu423mnsbdf', {
         expiresIn: "7d"
      }),
      {
        httpOnly: true
      })
    
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
