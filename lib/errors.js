// Owner-authored HTTP error helpers; no internal database or credential details.
export {keys,uuid,integer} from '../public/domain.js';
export const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
export const ERRORS={400:['BAD_REQUEST','Проверьте поля команды.','Пәрмен өрістерін тексеріңіз.'],401:['UNAUTHENTICATED','Войдите в кабинет.','Кабинетке кіріңіз.'],403:['FORBIDDEN','Действие недоступно для этого аккаунта.','Бұл аккаунтқа әрекет қолжетімсіз.'],404:['NOT_FOUND','Запись недоступна.','Жазба қолжетімсіз.'],405:['METHOD_NOT_ALLOWED','Метод недоступен.','Әдіс қолжетімсіз.'],409:['CONFLICT','Команда сейчас недоступна. Обновите данные и проверьте версии; ввод сохранится.','Пәрмен қазір қолжетімсіз. Деректерді жаңартып,нұсқаларды тексеріңіз;енгізу сақталады.'],413:['TOO_LARGE','Запрос превышает2МиБ.','Сұрау2МиБ шегінен асты.'],429:['RATE_LIMITED','Слишком много запросов. Повторите позже.','Сұрау тым көп. Кейін қайталаңыз.'],500:['INTERNAL','Не удалось обработать запрос.','Сұрау өңделмеді.']};
export function publicError(status){const[code,ru,kk]=ERRORS[status]||ERRORS[500];return {error:{code,message:{ru,kk}}};}
export function problem(status=400){return Object.assign(new Error(ERRORS[status]?.[0]||'INTERNAL'),{status});}
export function requireThat(ok,status=400){if(!ok)throw problem(status);}
export function username(v){requireThat(typeof v==='string'&&/^[a-zA-Z0-9_.-]{3,80}$/.test(v));return v;}
