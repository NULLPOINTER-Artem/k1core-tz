<template>
    <div class="bg-beige px-[202px] py-[113px] md:px-[52px] md:py-[115px] max-w-[100%]">
        <div class="flex items-center justify-start md:flex-col md:items-start flex-wrap">
            <div class="flex items-center justify-start md:items-start md:flex-col-reverse mr-[74px] md:mr-0">
                <div class="mr-[75px] md:flex md:flex-row-reverse md:mr-0 md:mt-[45px]">
                    <div>
                        <div class="text-blue font-bold leading-[38px] text-[20px]">
                            Телефон
                        </div>
                        <div class="text-gray font-medium leading-[34px] text-[18px]">
                            123-45-67
                        </div>
                    </div>

                    <div class="mt-[35px] md:mt-0 md:mr-[76px]">
                        <div class="text-blue font-bold leading-[38px] text-[20px]">
                            Электронная почта
                        </div>
                        <div class="text-gray font-medium leading-[34px] text-[18px]">
                            email@gmail.com
                        </div>
                    </div>
                </div>

                <div class="grid grid-rows-2 md:grid-rows-1 grid-flow-col gap-[46px]">
                    <svgo-twitter class="w-[64px]" filled :fontControlled="false" />
                    <svgo-facebook class="w-[64px]" filled :fontControlled="false" />
                    <svgo-vk class="w-[64px] md:order-last" filled :fontControlled="false" />
                    <svgo-instagram class="w-[64px] md:order-first" filled :fontControlled="false" />
                </div>
            </div>

            <form class="max-w-[502px] md:mt-[62px] md:min-w-[100%]" @submit="onSubmit">
                <div class="flex items-center justify-start md:flex-col md:items-start">
                    <div class="mr-[45px] max-w-[225px] md:max-w-[100%] md:w-[100%] md:mr-0 md:max-w-[100%]">
                        <input
                            class="placeholder-gray md:max-w-[100%] md:w-[100%] text-[18px] leading-[25px] px-[34px] py-[16px] bg-white rounded-[37px] placeholder-opacity-50 max-w-[225px]"
                            type="text" placeholder="Ваше имя" v-model="name">
                        <span class="text-[14px] mt-[8px] pl-[15px] text-red">{{ errors.name }}</span>
                    </div>

                    <div class="max-w-[225px] md:max-w-[100%] md:w-[100%] md:mt-[45px]">
                        <input
                            class="placeholder-gray text-[18px] md:max-w-[100%] md:w-[100%] leading-[25px] px-[34px] py-[16px] bg-white rounded-[37px] placeholder-opacity-50 max-w-[225px]"
                            type="text" placeholder="Ваш телефон" v-model="phone">
                        <span class="text-[14px] mt-[8px] pl-[15px] text-red">{{ errors.phone }}</span>
                    </div>
                </div>

                <div class="flex items-center justify-start md:items-start mt-[55px] md:mt-[29px] md:flex-col-reverse">
                    <button
                        class="bg-red cursor-pointer text-white text-[18px] leading-[25px] px-[34px] py-[16px] rounded-[37px] min-w-[225px] mr-[51px] md:mr-0 md:mt-[29px]"
                        :disabled="statusFetchUsers === 'pending'" type="submit">
                        Записаться
                    </button>

                    <p class="text-gray text-[18px] leading-[27px] md:max-w-[226px]">
                        Наш менеджер свяжется с вами в течении дня
                    </p>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useField, useForm } from 'vee-validate';
import { z } from 'zod';

/* Types */
type formState = {
    name: string,
    phone: string,
};

/* Constants */
const ENDPOINT = 'https://jsonplaceholder.typicode.com/users';

/* Hooks/Composables */
const userStore = useUserStore();

const formSchema = toTypedSchema(z.object({
    name: z.string().min(2, {
        message: 'This field is required'
    }),
    phone: z.string().regex(/^\d+$/, {
        message: "Phone number must contain only digits.",
    }).min(2, {
        message: 'This field is required'
    }),
}));

const { handleSubmit, errors } = useForm<formState>({
    validationSchema: formSchema,
});

const { value: name } = useField('name');
const { value: phone } = useField('phone');

const {
    data: users,
    status: statusFetchUsers,
    error: errorFetchUsers,
    execute: execFetchUsers,
} = await useFetch(ENDPOINT, { lazy: false, immediate: false });

const onSubmit = handleSubmit(async (values: formState) => {
    try {
        await execFetchUsers();

        if (errorFetchUsers.value?.message) throw new Error(errorFetchUsers.value?.message);

        userStore.setName(values.name);
        userStore.setPhone(values.phone);

        window.alert(`Name: ${values.name}, Phone: ${values.phone}\n${JSON.stringify(users.value, null, 2)}`);
    } catch (error) {
        console.error(error);
    }
});
</script>