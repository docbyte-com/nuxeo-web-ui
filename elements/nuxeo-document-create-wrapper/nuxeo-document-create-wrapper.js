/**
 @license
 (C) Copyright Nuxeo Corp. (http://nuxeo.com/)

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
import '@polymer/polymer/polymer-legacy.js';

import '@nuxeo/nuxeo-elements/nuxeo-document.js';
import { I18nBehavior } from '@nuxeo/nuxeo-ui-elements/nuxeo-i18n-behavior.js';
import '@nuxeo/nuxeo-ui-elements/nuxeo-slots.js';
import '@nuxeo/nuxeo-ui-elements/widgets/nuxeo-tooltip.js';
import '@polymer/paper-fab/paper-fab.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
import '../nuxeo-document-creation-stats/nuxeo-document-creation-stats.js';
import '../nuxeo-keys/nuxeo-keys.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

/**
 `nuxeo-document-create-wrapper`
 @group Nuxeo UI
 @element nuxeo-document-create-wrapper
 */
Polymer({
    _template: html`
        <nuxeo-document-create-button
                class$="[[page]]"
                parent="[[currentParent]]"
                hidden$="[[isMobile]]"
        ></nuxeo-document-create-button>
        <nuxeo-document-create-popup
                id="importPopup"
                parent="[[currentParent]]"
                default-path="/"
        ></nuxeo-document-create-popup>
  `,

    is: 'nuxeo-document-create-wrapper',
    behaviors: [I18nBehavior],

    properties: {
        page: Object,
        currentParent: Object,
        isMobile: Object,
    },

    _showDocumentCreationWizard(e) {
        if (e.detail.keyboardEvent) {
            e.detail.keyboardEvent.preventDefault();
        }
        if (e.detail.files) {
            this.$.importPopup.toggleDialogImport(e.detail.files);
        } else if (e.detail.type) {
            this.$.importPopup.toggleDialogCreate(e.detail.type);
        } else {
            this.$.importPopup.toggleDialog();
        }
    },
});
