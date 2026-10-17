---
sidebar_position: 4
description: 'Buying a plan for an installation, Paddle as the merchant of record, changing a plan, canceling and refunds.'
---

# Buying and billing

Plans are sold through the license portal, `portal.hivepaas.com`, for one
installation each. [Paddle](https://www.paddle.com) takes the payment.

## Buy a plan

1. In **System → License**, click **Upgrade**. It opens the portal's pricing
   page for this installation.
2. Choose **Monthly** or **Yearly**, and click **Subscribe** under a plan.
3. Sign in to the portal, or create an account with your email address.
4. Check the **Installation ID**, and click **Continue to payment**.
5. Pay in Paddle's checkout: by card, PayPal, Apple Pay or Google Pay.
6. The portal issues the license: `Your Hive license is ready`. It shows the
   key, emails it, and keeps it under **Licenses**.
7. Paste the key into **System → License**: see
   [Install a license key](./install-a-license-key.md#paste-it).

From then on, renewals reach the installation by themselves, or by email: see
[Renewal and privacy](./renewal-and-privacy.md).

The pricing page at [hivepaas.com/pricing](https://hivepaas.com/pricing) leads to
the same checkout; the portal then asks for the installation ID, which **System →
License** shows.

If the key does not show within a minute of paying, the portal says
`Payment received: your key is on its way`: it is emailed, and appears under
**Licenses**, once Paddle has confirmed the payment.

### One license per installation

A license is for one installation, and an installation has one license. Buying
for an installation that already has a license in force is refused:
`This installation already has a license in force. Change the plan of your subscription instead.`
A trial on the installation is not in the way: the paid key replaces it.

## Paddle, the merchant of record

Paddle sells HivePaaS licenses as the merchant of record. It charges you,
works out and collects the sales tax or VAT where you are, and issues the
receipts and invoices. Your payment details go to Paddle, never to HivePaaS or
its portal.

Prices are set in US dollars. The portal's pricing page shows them in your
currency, and the checkout shows exactly what you pay, tax included.

## Your subscriptions

The portal's **Subscriptions** lists each subscription: its plan and billing
period, its status, the day it **Renews on**, the **Current period**, and its
license.

**Manage billing** opens Paddle's billing portal, for your payment method, your
invoices, and canceling. It shows once the account has bought something.

## Change plan

In **Subscriptions**, click **Change plan**, and pick the plan and the billing
period to change to. Only an active subscription can change its plan.

- **An upgrade**, to a higher plan, or from monthly to yearly, is charged now,
  prorated for what is left of the period: **Upgrade and pay**. If the payment
  fails, the plan stays as it is.
- **A downgrade**, to a lower plan, or from yearly to monthly, charges nothing
  now: the new price is billed from the next period.

Either way the license gets a key with the new plan's limits at once, with the
same end date. The portal shows it and emails it; paste it, or let the daily
check fetch it. After a downgrade, everything keeps running: over the new plan's
limits, nothing more of that kind can be added. See
[Grace, expiry and limits](./grace-expiry-and-limits.md).

## Cancel

In **Manage billing**, cancel the subscription in Paddle's billing portal. It
runs to the end of the period paid for: **Subscriptions** shows the day it
**Cancels on**.

No key follows. The last one holds to its end date, then for its 14 days of
grace, and then the installation is on Bee. Nothing that runs is stopped.

## When a payment fails

When Paddle cannot charge a renewal, it tries again for up to 14 days, then
cancels the subscription. Meanwhile the portal says `A payment is failing`, with
**Update your card**, which opens Paddle's billing portal.

The installation keeps its plan all along: a key holds for 14 days past the
period it was paid for, which covers Paddle's tries. Once a payment goes
through, the renewed key follows as usual.

## Refunds

A payment is refunded in full on request within 14 days. Ask Paddle for it, at
[paddle.net](https://paddle.net), where you find the order by the email on its
receipt: refunds are Paddle's to make, not something to write to HivePaaS about.

When a payment for a period - the first one or a renewal - is refunded in full,
the portal revokes its license by itself, issuing no more keys for it, and
cancels its subscription at once, so nothing more is charged. The key already
installed keeps working to its end date and through its grace, as a key is
checked offline and cannot be called back. A partial refund, a credit, or a
refund of a plan change's charge changes nothing.

See the [refund policy](https://hivepaas.com/refunds).

## Apiary

Apiary is quoted, and paid by invoice rather than through the checkout: ask
through **Contact us** on the [pricing page](https://hivepaas.com/pricing). Its
keys are issued and renewed by hand, and show under **Licenses** like any other.
