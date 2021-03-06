define([
    "jquery", "common/js/spec_helpers/ajax_helpers", "js/spec_helpers/view_helpers",
    "js/factories/manage_users_lib", "js/views/utils/view_utils"
],
function ($, AjaxHelpers, ViewHelpers, ManageUsersFactory, ViewUtils) {
    "use strict";
    describe("Library Instructor Access Page", function () {
        const changeRoleUrl = "dummy_change_role_url/@@EMAIL@@";
        var team_member_fixture = readFixtures("team-member.underscore");
        var systemFeedbackFixture = readFixtures("system-feedback.underscore");

        function setRole(email, role){
            var user_li = $("li.user-item[data-email="+ email + "]");
            var role_action = $("li.action-role a.make-"+role, user_li);
            expect(role_action).toBeVisible();
            role_action.click();
        }

        function getUrl(email) {
            return changeRoleUrl.replace('@@EMAIL@@', email);
        }

        describe("read-write access", function() {
            var mockHTML = readFixtures('mock/mock-manage-users-lib.underscore');

            beforeEach(function () {
                ViewHelpers.installMockAnalytics();
                setFixtures(mockHTML);
                appendSetFixtures($("<script>", { id: "team-member-tpl", type: "text/template"}).text(team_member_fixture));
                appendSetFixtures($("<script>", { id: "system-feedback-tpl", type: "text/template"}).text(systemFeedbackFixture));
                ManageUsersFactory(
                    "Mock Library",
                    [
                        {id: 1, email: "honor@example.com", username:"honor", role: 'staff'},
                        {id: 2, email: "audit@example.com", username:"audit", role: 'instructor'},
                        {id: 3, email: "staff@example.com", username:"staff", role: 'library_user'}
                    ],
                    changeRoleUrl,
                    10000,
                    true
                );
                waitsFor(function(){
                   return $(".ui-loading").length === 0;
                }, "Waiting for backbone render to happen", 1000);
            });

            afterEach(function () {
                ViewHelpers.removeMockAnalytics();
            });

            it("can give a user permission to use the library", function () {
                const email = 'other@example.com';
                var requests = AjaxHelpers.requests(this);
                var reloadSpy = spyOn(ViewUtils, 'reload');
                $('.create-user-button').click();
                expect($('.wrapper-create-user')).toHaveClass('is-shown');
                $('.user-email-input').val(email);
                $('.form-create.create-user .action-primary').click();
                AjaxHelpers.expectJsonRequest(requests, 'POST', getUrl(email), {role: 'library_user'});
                AjaxHelpers.respondWithJson(requests, {'result': 'ok'});
                expect(reloadSpy).toHaveBeenCalled();
            });

            it("can promote user", function() {
                const email = "staff@example.com";
                var requests = AjaxHelpers.requests(this);
                var reloadSpy = spyOn(ViewUtils, 'reload');
                setRole("staff@example.com", 'staff');
                AjaxHelpers.expectJsonRequest(requests, 'POST', getUrl(email), {role: 'staff'});
                AjaxHelpers.respondWithJson(requests, {'result': 'ok'});
                expect(reloadSpy).toHaveBeenCalled();
            });

            it("can cancel adding a user to the library", function () {
                $('.create-user-button').click();
                $('.form-create.create-user .action-secondary').click();
                expect($('.wrapper-create-user')).not.toHaveClass('is-shown');
            });

            it("displays an error when the required field is blank", function () {
                var requests = AjaxHelpers.requests(this);
                $('.create-user-button').click();
                $('.user-email-input').val('');
                var errorPromptSelector = '.wrapper-prompt.is-shown .prompt.error';
                expect($(errorPromptSelector).length).toEqual(0);
                $('.form-create.create-user .action-primary').click();
                expect($(errorPromptSelector).length).toEqual(1);
                expect($(errorPromptSelector)).toContainText('You must enter a valid email address');
                expect(requests.length).toEqual(0);
            });

            it("displays an error when the user has already been added", function () {
                var requests = AjaxHelpers.requests(this);
                $('.create-user-button').click();
                $('.user-email-input').val('honor@example.com');
                var warningPromptSelector = '.wrapper-prompt.is-shown .prompt.warning';
                expect($(warningPromptSelector).length).toEqual(0);
                $('.form-create.create-user .action-primary').click();
                expect($(warningPromptSelector).length).toEqual(1);
                expect($(warningPromptSelector)).toContainText('Already a library team member');
                expect(requests.length).toEqual(0);
            });


            it("can remove a user's permission to access the library", function () {
                var requests = AjaxHelpers.requests(this);
                var reloadSpy = spyOn(ViewUtils, 'reload');
                var email = "honor@example.com";
                $('.user-item[data-email="'+email+'"] .action-delete .delete').click();
                expect($('.wrapper-prompt.is-shown .prompt.warning').length).toEqual(1);
                $('.wrapper-prompt.is-shown .action-primary').click();
                AjaxHelpers.expectJsonRequest(requests, 'DELETE', getUrl(email), {role: null});
                AjaxHelpers.respondWithJson(requests, {'result': 'ok'});
                expect(reloadSpy).toHaveBeenCalled();
            });
        });

        describe("read-only access", function() {
            var mockHTML = readFixtures('mock/mock-manage-users-lib-ro.underscore');

            beforeEach(function () {
                ViewHelpers.installMockAnalytics();
                setFixtures(mockHTML);
                appendSetFixtures($("<script>", { id: "team-member-tpl", type: "text/template"}).text(team_member_fixture));
                appendSetFixtures($("<script>", { id: "system-feedback-tpl", type: "text/template"}).text(systemFeedbackFixture));
                ManageUsersFactory(
                    "Mock Library",
                    [
                        {id: 1, email: "honor@example.com", username:"honor", role: 'staff'},
                        {id: 2, email: "audit@example.com", username:"audit", role: 'instructor'},
                        {id: 3, email: "staff@example.com", username:"staff", role: 'library_user'}
                    ],
                    "dummy_change_role_url",
                    10000,
                    false
                );
            });

            afterEach(function () {
                ViewHelpers.removeMockAnalytics();
            });

            it("can't give a user permission to use the library", function () {
                expect($('.create-user-button')).not.toBeVisible();
                expect($('.wrapper-create-user')).not.toBeVisible();
            });

            it("can't promote or demote user", function () {
                expect($('.action-role')).not.toBeVisible();
            });
        });
    });
});
