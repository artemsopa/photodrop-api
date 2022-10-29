import * as yup from 'yup';

export const idSchema = yup.object().shape({
  id: yup.string().required(),
}).unknown(true);

export const loginSchema = yup.object({
  login: yup.string().min(4).max(30).lowercase()
    .required(),
  password: yup.string().min(6).max(30).required(),
});

export const phoneSchema = yup.object({
  phone: yup.string().required(),
});

export const verifySchema = yup.object({
  phone: yup.string().required(),
  code: yup.string().required(),
});

export const albumInputSchema = yup.object({
  title: yup.string().min(2).max(30).required(),
  location: yup.string().required(),
  date: yup.number().required(),
});

export const photoSignedUrlSchema = yup.object({
  albumId: yup.string().required(),
  contentType: yup.string().required(),
});

export const keysInputSchema = yup.object({
  albumId: yup.string().required(),
  keys: yup.array(yup.string().required()).required(),
});

export const ordersInputSchema = yup.object({
  albumId: yup.string().required(),
  orders: yup.array(
    yup.object().shape({
      photoId: yup.string().required(),
      users: yup.array(
        yup.object({
          userId: yup.string().required(),
          phone: yup.string().required(),
        }).required(),
      ),
    }).required(),
  ).required(),
});

export const updatePhoneSchema = yup.object({
  phone: yup.string().required(),
  code: yup.string().required(),
});

export const updateEmailSchema = yup.object({
  email: yup.string().required(),
});

export const updateFullNameSchema = yup.object({
  fullName: yup.string().required(),
});

export const avatarSignedUrlSchema = yup.object({
  contentType: yup.string().required(),
});

export const updateAvatarSchema = yup.object({
  key: yup.string().required(),
});
