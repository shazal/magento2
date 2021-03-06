/**
 * Copyright © 2015 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */
/*global define*/
define(
    [
        '../model/url-builder',
        'mage/storage',
        'Magento_Ui/js/model/errorlist',
        'mage/url'
    ],
    function(urlBuilder, storage, errorList, url) {
        "use strict";
        return function(giftMessage, remove) {
            url.setBaseUrl(giftMessage.getConfigValue('baseUrl'));
            var quoteId = giftMessage.getConfigValue('quoteId');
            var serviceUrl;
            if (giftMessage.getConfigValue('isCustomerLoggedIn')) {
                serviceUrl = urlBuilder.createUrl('/carts/mine/gift-message', {});
                if (giftMessage.itemId != 'orderLevel') {
                    serviceUrl = urlBuilder.createUrl('/carts/mine/gift-message/:itemId', {itemId: giftMessage.itemId});
                }
            } else {
                serviceUrl = urlBuilder.createUrl('/guest-carts/:cartId/gift-message', {cartId: quoteId});
                if (giftMessage.itemId != 'orderLevel') {
                    serviceUrl = urlBuilder.createUrl(
                        '/guest-carts/:cartId/gift-message/:itemId',
                        {cartId: quoteId, itemId: giftMessage.itemId}
                    );
                }
            }
            errorList.clear();

            storage.post(
                serviceUrl,
                JSON.stringify({
                    gift_message: giftMessage.getSubmitParams(remove)
                })
            ).done(
                function(result) {
                    giftMessage.reset();
                    _.each(giftMessage.getAfterSubmitCallbacks(), function(callback) {
                        if (_.isFunction(callback)) {
                            callback();
                        }
                    });
                }
            ).fail(
                function(response) {
                    var error = JSON.parse(response.responseText);
                    errorList.add(error);
                }
            );
        };
    }
);
