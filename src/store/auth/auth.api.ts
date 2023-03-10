import {createApi} from "@reduxjs/toolkit/query/react"
import baseQuery from "../../app/api";
import { LoginRequest, LoginResponse, SignUpRequest } from "../../app/interfaces/auth.types"
import userApi from "../user/user.api";

const authApi = createApi({
    reducerPath: 'api/auth',
    baseQuery,
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: "auth/jwt/create",
                method: "POST",
                body: credentials
            }),
            // async onQueryStarted(_, {dispatch, queryFulfilled}) {
            //     try {
            //         dispatch(userApi.util.resetApiState())
            //         await queryFulfilled
            //         dispatch(userApi.endpoints.userInfo.initiate())
            //     } catch {
            //     }
            // },
        }),
		signup: builder.mutation<LoginResponse, SignUpRequest>({
			query: (credentials) => ({
				url: "users/",
				method: "POST",
				body: credentials
			})
		}),
        refresh: builder.mutation<{access:string}, string>({
            query: (refresh) => ({
                url: "auth/jwt/refresh/",
                method: "POST",
                body: {refresh}
            })
        }),
        permissions: builder.mutation<string[], void>({
            query: (args) => `/permissions/`,
            transformResponse: (res: {permissions: []}, _, q: void | number) => res.permissions
        }),
    })
});

export const { useLoginMutation, usePermissionsMutation, useRefreshMutation, useSignupMutation } = authApi;

export default authApi
