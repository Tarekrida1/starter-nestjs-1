import { HttpException, HttpStatus } from "@nestjs/common";
export const mongoErrorHandler = (err) => {

  // mongoose bag ObjectId
if(err.name === "CastError") {
 err.message = `Recourse not found with id of ${err.value}`;
  err.statusCode = 404;
}

  // mongoose Duplicate key
  if(err.code === 11000) {
     err.message = `Duplicate field value entered`;
      err.statusCode = 400;
  }


  // mongoose validation errs
  // if(err.name === 'ValidationError') {

  //    err.message = Object.values(err.errs).map((val) => val['message']);
  //     err.statusCode = 400;
  // }

  throw new HttpException(err.message, err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR);

  // return err
}
