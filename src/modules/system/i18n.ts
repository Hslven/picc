import i18n from './i18n.json';

class index implements Module {
    i18n(): object {
        return i18n;
    }
}

export default new index();
