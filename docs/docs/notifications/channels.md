---
sidebar_position: 1
description: 'Email, Slack, Discord, Telegram and Lark.'
---

# Channels

HivePaaS sends notifications by email, and to Slack, Discord, Telegram and Lark.
Set up each channel once, in **Integrations**, globally or in a project.

## Email accounts

In **Integrations → Email Accounts**, create one of two kinds:

**SMTP**, for any mail server or service with SMTP, such as Gmail, Amazon SES,
Mailgun or Postmark:

- **Host** and **Port**, such as `smtp.example.com` and `587`, and whether it
  uses SSL;
- **Username** and **Password**;
- **Display Name**, the sender's name in the mail.

**HTTP**, for a sending service with an API: its **Endpoint**, **Method**,
**Headers**, and **Field Mappings** that say where each part of a mail goes in
the request, such as the recipient, the subject and the content.

**Test Send Mail** sends a mail to check the account works.

### The system's email

HivePaaS's own mails, such as invitations and password resets, go through the
global email account: the only one, or with several, the one marked
**Default**. With several and none marked, they are not sent. Set one up before
inviting users by email.

## IM platforms

In **Integrations → IM Platforms**, create one:

| Platform     | What to give                                                                                    |
| ------------ | ----------------------------------------------------------------------------------------------- |
| **Slack**    | An incoming webhook URL, made in Slack for a channel.                                           |
| **Discord**  | A webhook URL, made in the Discord channel's settings, under Integrations.                      |
| **Telegram** | A bot's **Bot Token**, from @BotFather, and the **Chat ID** of the chat or group the bot is in. |
| **Lark**     | A custom bot's webhook URL, and its **Secret** if the bot has signature verification on.        |

## Next

Channels say how notifications travel. [Notification targets](./notification-targets.md)
say who gets them.
