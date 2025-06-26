/**
@license
©2023 Hyland Software, Inc. and its affiliates. All rights reserved. 
All Hyland product names are registered or unregistered trademarks of Hyland Software, Inc. or its affiliates.

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
import '@nuxeo/nuxeo-elements/nuxeo-element.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { I18nBehavior } from '@nuxeo/nuxeo-ui-elements/nuxeo-i18n-behavior.js';

{
  /**
   * Custom error component with enhanced styling.
   * Maintains the same API as nuxeo-error for drop-in replacement.
   *
   * Example:
   *
   *     <custom-error code="404"></custom-error>
   *
   * @appliesMixin Nuxeo.I18nBehavior
   * @memberof Nuxeo
   */
  class CustomError extends mixinBehaviors([I18nBehavior], Nuxeo.Element) {
    static get template() {
      return html`
        <style include="nuxeo-styles">
          :host {
            display: block;
            padding: 2rem;
          }

          :host([hidden]) {
            display: none !important;
          }

          .error-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            text-align: center;
          }

          .error-title {
            font-size: 2rem;
            font-weight: bold;
            color: var(--nuxeo-text-default);
            margin-bottom: 1rem;
          }

          .error-info {
            display: grid;
            grid-template-columns: 1fr;
            gap: 2rem;
            max-width: 600px;
            margin-top: 2rem;
            text-align: left;
          }

          .error-field {
            background-color: var(--nuxeo-box);
            border-radius: 8px;
            padding: 1.5rem;
            border: 1px solid var(--nuxeo-border);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .error-field-label {
            font-weight: bold;
            color: var(--nuxeo-primary-color);
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 0.5rem;
          }

          .error-field-value {
            color: var(--nuxeo-text-default);
            font-size: 1rem;
            line-height: 1.4;
            word-break: break-word;
          }

          .error-field.full-width {
            grid-column: 1 / -1;
          }

          .error-field.message {
            background-color: var(--nuxeo-warn-background, #fff3cd);
            border-color: var(--nuxeo-warn-text, #856404);
          }

          @media (max-width: 768px) {
            .error-info {
              grid-template-columns: 1fr;
              gap: 1rem;
            }
          }

          .custom-logo {
            max-width: 200px;
            margin-bottom: 2rem;
          }

          .url-info {
            color: var(--nuxeo-text-light);
            font-size: 0.9rem;
            margin-bottom: 1rem;
            max-width: 600px;
            word-break: break-word;
          }
        </style>

        <div class="error-container">
          <img src="[[_computeLogoPath(baseUrl)]]" alt="Docbyte Logo" class="custom-logo" />

          <div class="error-title">[[_getErrorTitle(code)]]</div>

          <div class="error-info">
            <div class="error-field">
              <div class="error-field-label">[[_getStatusCodeLabel()]]</div>
              <div class="error-field-value">[[code]]</div>
            </div>

            <div class="error-field message full-width" hidden$="[[!_hasMessage(code, message)]]">
              <div class="error-field-label">[[_getMessageLabel()]]</div>
              <div class="error-field-value">
                [[_computeMessage(code)]]
              </div>
            </div>
          </div>
        </div>
      `;
    }

    static get is() {
      return 'custom-error';
    }

    static get properties() {
      return {
        /**
         * The error code. Description will rely on a label with key 'error.<code>'.
         * */
        code: {
          type: String,
          value: '',
        },

        /**
         * Error message to display.
         * */
        message: {
          type: String,
          value: '',
        },

        url: {
          type: String,
          value: '',
        },

        hidden: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
        },

        baseUrl: {
          type: String,
          value: '',
        },
      };
    }

    ready() {
      super.ready();
      // Get base URL from the app
      this.baseUrl = document.querySelector('nuxeo-app')?.baseUrl || '';
    }

    show(code, url, message) {
      if (arguments.length) {
        this.code = code;
        this.url = url;
        this.message = message;
      }
      this.hidden = false;
    }

    hide() {
      this.hidden = true;
    }

    _computeLogoPath(baseUrl) {
      const theme = localStorage.getItem('theme') || 'default';
      return `${baseUrl}themes/${theme}/logo.png`;
    }

    _getErrorTitle(code) {
      // Try to get i18n title first
      const i18nTitle = this.code ? this.i18n(`error.${this.code}.title`) : null;
      if (i18nTitle && i18nTitle !== `error.${this.code}.title`) {
        return i18nTitle;
      }

      // Fall back to hardcoded titles
      const numCode = parseInt(code, 10);
      switch (numCode) {
        case 403:
          return 'Access Denied';
        case 404:
          return 'Page Not Found';
        case 500:
          return 'Server Error';
        default:
          return code ? `Error ${code}` : 'Oops! Something went wrong';
      }
    }

    _getErrorMessage(code) {
      // Try to get i18n message first
      const i18nMessage = this.code ? this.i18n(`error.${this.code}.message`) : null;
      if (i18nMessage && i18nMessage !== `error.${this.code}.message`) {
        return i18nMessage;
      }

      // Fall back to hardcoded messages
      const numCode = parseInt(code, 10);
      switch (numCode) {
        case 403:
          return "You don't have permission to access this resource.";
        case 404:
          return "The page you're looking for doesn't exist or has been moved.";
        case 500:
          return "We're experiencing technical difficulties. Please try again later.";
        default:
          return 'An unexpected error occurred. Please try again or contact support if the problem persists.';
      }
    }

    _hasMessage(code, message) {
      return !!(code || message);
    }

    _getStatusCodeLabel() {
      // Try to get i18n label first
      const i18nLabel = this.i18n('error.statusCode.label');
      if (i18nLabel && i18nLabel !== 'error.statusCode.label') {
        return i18nLabel;
      }
      // Fall back to hardcoded label
      return 'Status Code';
    }

    _getMessageLabel() {
      // Try to get i18n label first
      const i18nLabel = this.i18n('error.message.label');
      if (i18nLabel && i18nLabel !== 'error.message.label') {
        return i18nLabel;
      }
      // Fall back to hardcoded label
      return 'Message';
    }

    /**
     * Returns the provided message if available, otherwise falls back to the
     * _getErrorMessage which handles i18n and hardcoded fallbacks.
     */
    _computeMessage(code) {
      //   if (message) {
      //     return message;
      //   }
      // Use _getErrorMessage which now handles both i18n and fallbacks
      return this._getErrorMessage(code);
    }
  }

  customElements.define(CustomError.is, CustomError);
  Nuxeo.CustomError = CustomError;
}
