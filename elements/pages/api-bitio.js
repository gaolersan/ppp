import { html, css, ref } from '../../vendor/fast-element.min.js';
import {
  Page,
  pageStyles,
  documentPageHeaderPartial,
  documentPageFooterPartial
} from '../page.js';
import { APIS } from '../../lib/const.js';
import '../badge.js';
import '../button.js';
import '../text-field.js';

export const apiBitioPageTemplate = html`
  <template class="${(x) => x.generateClasses()}">
    <ppp-loader></ppp-loader>
    <form novalidate>
      ${documentPageHeaderPartial({
        pageUrl: import.meta.url
      })}
      <section>
        <div class="label-group">
          <h5>Название подключения</h5>
          <p class="description">
            Произвольное имя, чтобы ссылаться на этот профиль, когда
            потребуется.
          </p>
        </div>
        <div class="input-group">
          <ppp-text-field
            placeholder="PostgreSQL"
            value="${(x) => x.document.name}"
            ${ref('name')}
          ></ppp-text-field>
        </div>
      </section>
      <section>
        <div class="label-group">
          <h5>Ключ API базы данных</h5>
          <p class="description">
            API-ключ базы bit.io. Можно получить в панели управления на вкладке
            Connect.
          </p>
        </div>
        <div class="input-group">
          <ppp-text-field
            type="password"
            placeholder="API-ключ"
            value="${(x) => x.document.apiKey}"
            ${ref('apiKey')}
          ></ppp-text-field>
        </div>
      </section>
      <section>
        <div class="label-group">
          <h5>База данных</h5>
          <p class="description">Название базы данных для подключения.</p>
        </div>
        <div class="input-group">
          <ppp-text-field
            placeholder="ppp"
            value="${(x) => x.document.db}"
            ${ref('db')}
          ></ppp-text-field>
        </div>
      </section>
      ${documentPageFooterPartial()}
    </form>
  </template>
`;

export const apiBitioPageStyles = css`
  ${pageStyles}
`;

export class ApiBitioPage extends Page {
  collection = 'apis';

  async read() {
    return (context) => {
      return context.services
        .get('mongodb-atlas')
        .db('ppp')
        .collection('[%#this.collection%]')
        .findOne({
          _id: new BSON.ObjectId('[%#payload.documentId%]'),
          type: `[%#(await import(ppp.rootUrl + '/lib/const.js')).APIS.BITIO%]`
        });
    };
  }

  async find() {
    return {
      type: APIS.BITIO,
      name: this.name.value.trim(),
      removed: { $ne: true }
    };
  }

  async submit() {
    return false;
  }
}

export default ApiBitioPage.compose({
  template: apiBitioPageTemplate,
  styles: apiBitioPageStyles
}).define();
