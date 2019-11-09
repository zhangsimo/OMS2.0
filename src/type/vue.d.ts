import Vue from 'vue';
import { AxiosInstance } from "axios";
import { LoDashStatic } from 'lodash';

declare module 'vue/types/vue' {
    interface Vue {
        ajaxAll: AxiosInstance,
        _: LoDashStatic,
    }
}