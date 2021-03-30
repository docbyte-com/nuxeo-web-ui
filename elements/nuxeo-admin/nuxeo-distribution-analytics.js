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

import '@polymer/iron-icon/iron-icon.js';
import '@polymer/paper-slider/paper-slider.js';
import '@nuxeo/nuxeo-ui-elements/widgets/nuxeo-card.js';
import '@nuxeo/nuxeo-ui-elements/nuxeo-path-suggestion/nuxeo-path-suggestion.js';
import '@nuxeo/nuxeo-ui-elements/dataviz/nuxeo-document-distribution-chart.js';
import './nuxeo-mime-types.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { I18nBehavior } from '@nuxeo/nuxeo-ui-elements/nuxeo-i18n-behavior.js';

/**
`nuxeo-distribution-analytics`
@group Nuxeo UI
@element nuxeo-distribution-analytics
*/
Polymer({
  _template: html`
    <style include="iron-flex">
      :host {
        display: block;
      }

      .suggestion-wrapper {
        border-radius: 2px;
        border: 1px solid var(--nuxeo-border);
        padding: 0 8px;
      }

      .suggestion-wrapper iron-icon {
        color: var(--dark-primary-color);
        margin-right: 8px;
      }

      paper-slider {
        width: 100%;
      }

      nuxeo-path-suggestion {
        --nuxeo-path-suggestion-results: {
          z-index: 2;
        }
        --paper-input-container-underline: {
          display: none;
        }
        --paper-input-container-underline-focus: {
          display: none;
        }
      }

      .error {
        border-left: 4px solid var(--nuxeo-warn-text);
        color: var(--nuxeo-text-default);
        padding-left: 8px;
      }
    </style>

    <nuxeo-page-provider
      id="provider"
      provider="nxql_search"
      page-size="1"
      schemas="dublincore,uid"
      headers="[[_headers()]]"
      skip-aggregates
      on-error="_onError"
    >
    </nuxeo-page-provider>

    <div class="flex-layout">
      <nuxeo-card>
        <div class="suggestion-wrapper horizontal layout center">
          <iron-icon icon="icons:folder"></iron-icon>
          <div class="flex">
            <nuxeo-path-suggestion id="pathSuggester" value="{{path}}"></nuxeo-path-suggestion>
          </div>
        </div>

        <template is="dom-if" if="[[_enabled]]">
          <nuxeo-document-distribution-chart
            id="chart"
            index="[[index]]"
            mode="count"
            include-version
            include-hidden
            include-deleted
          >
          </nuxeo-document-distribution-chart>

          <div class="horizontal layout center">
            <div>
              <iron-icon icon="icons:track-changes"></iron-icon>
            </div>
            <div class="flex">
              <paper-slider id="ratings" pin snaps max="20" max-markers="20" step="1" value="{{depth}}"></paper-slider>
            </div>
          </div>
        </template>

        <template is="dom-if" if="[[!_enabled]]">
          <p class="error">
            Distribution analytics is disabled because current query would impact quality of the service. <br />
            Please select another path.
          </p>
        </template>
      </nuxeo-card>
    </div>
  `,

  is: 'nuxeo-distribution-analytics',
  behaviors: [I18nBehavior],

  properties: {
    index: {
      type: String,
      value: '_all',
    },
    path: {
      type: String,
    },
    depth: {
      type: Number,
      value: 7,
    },
    enableThreshold: {
      type: Number,
    },
    _enabled: {
      type: Boolean,
      value: false,
    },
  },

  observers: ['_observeDocPath(path, depth)'],

  _params() {
    return {
      queryParams:
        'SELECT * FROM Document ' +
        "WHERE ecm:mixinType != 'HiddenInNavigation' " +
        'AND ecm:isProxy = 0 AND ' +
        'ecm:isVersion = 0 AND ' +
        'ecm:isTrashed = 0 AND ' +
        `ecm:path STARTSWITH '${this.path}'`,
    };
  },

  _headers() {
    return {
      'Content-Type': 'application/json',
      accept: 'text/plain,application/json',
      'fetch-document': 'properties',
    };
  },

  _observeDocPath() {
    if (this.path && this.path.length && this.path.endsWith('/')) {
      this.$.provider.params = this._params();
      this.$.provider.fetch().then((result) => {
        this._enabled = result.resultsCount < this.enableThreshold;
        if (this._enabled) {
          this.async(() => {
            if (this.path !== this.$$('#chart').path || this.depth !== this.$$('#chart').maxDepth) {
              this.$$('#chart').maxDepth = this.depth;
              this.$$('#chart').path = this.path;
              this.$$('#chart').execute();
            }
          });
        }
      });
    }
  },
});
