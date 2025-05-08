import { CheckoutOptions } from 'react-native-razorpay';
import { RS } from '@/constants/currency';
import { Color } from '@/styles/tokens';
import { Order, OrderStatus } from '@/types/order';
import { BillingAddress } from '@/types/user';
import { lightTheme } from '@/styles/themes';
import { formatRupee } from './formatters';

export function getOrderStatusBadgeColor(status: OrderStatus): Color {
  switch (status) {
    case 'pending':
      return 'primary';
    case 'processing':
      return 'blue';
    case 'on-hold':
      return 'yellow';
    case 'completed':
      return 'green';
    case 'cancelled':
      return 'red';
    case 'refunded':
      return 'purple';
    case 'failed':
      return 'red';
    case 'trash':
      return 'neutral';
    default:
      return 'neutral';
  }
}

const COMPANY = {
  name: 'Lelekart',
  email: 'support@lelekart.com',
  phone: '+91 9877454036',
} as const;

export function generateOrderInvoiceHtml({
  order,
  company = COMPANY,
}: {
  order: Order;
  company?: typeof COMPANY;
}) {
  const billing = order.billing;

  const orderNumber = order.number;

  const orderDate = new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'short',
  }).format(new Date(order.date_created)); // dd/mm/yyyy

  const [date, month, year] = orderDate.split('/');
  const orderDateString = `${date}-${month}-${year}`;

  const lineItems = order.line_items;
  const taxLines = order.tax_lines;

  const discount = formatRupee(order.discount_total);
  const shipping = formatRupee(order.shipping_total);
  const total = formatRupee(order.total);

  return `
<html>
<style>
	*,
	*::before,
	*::after {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	html,
	body {
		margin: 0;
		padding: 0;
		font-family: Arial, sans-serif;
		font-size: 14px;
		line-height: 20px;
		color: #111;
		background-color: #fff;
		max-width: 800px;
		margin: auto;
	}

	body {
		padding: 24px;
	}

	table: {
		width: 100%;
		border-collapse: collapse;
	}

	table,
	th,
	td {
		border-block: 1px solid #D7DAE0;
		border-collapse: collapse;
	}
	
	table {
		border: none !important;
	}

	td,
	th {
		padding: 12px;
		text-align: left;
	}
	
	.empty-td, .last-td {
		border: none !important;
	}
	.align-right {
		text-align: right;
	}
</style>

<body>
	<div style="padding-bottom: 16px; display: flex; justify-content: space-between;">
		<div style="display: flex; flex-direction: column; gap: 4px;">
			<h2 style="color: #1A1C21;">${company.name}</h2>
			<p>${company.email}</p>
			<p>${company.phone}</p>
		</div>
	</div>
	<div style="padding: 20px 0px; width: 100%;">

		<div style="display: flex; gap: 48px; padding-bottom: 36px;">
			<div style="display: flex; flex-direction: column; gap: 4px;">
				<b>Bill to</b>
				<p>${billing.first_name} ${billing.last_name}</p>
				<p>${billing.email}</p>
				<p>${billing.phone}</p>
				<p>${billing.address_1}</p>
				<p>${billing.postcode}, ${billing.city}, ${billing.country}</p>
			</div>
			<div style="display: flex; flex-direction: column; gap: 2px;">
				<div><b>Invoice no: </b> ${orderNumber}</div>
				<div><b>Order date: </b> ${orderDateString}</div>
			</div>
		</div>

		<table>
			<tr>
				<th class="empty-td">No.</th>
				<th class="empty-td" style="width: 60%;">Item</th>
				<th class="empty-td">Quantity</th>
				<th class="empty-td" style="width: 20%">Unit price</th>
				<th class="empty-td align-right" style="width: 20%">Total price</th>
			</tr>
			<tbody>
        ${lineItems.map((item, i) => {
          const unitPrice = parseFloat(item.price).toFixed(2);
          const totalPrice = parseFloat(
            `${Number(item.price) * item.quantity}`,
          ).toFixed(2);
          return `
          <tr>
            <td>${i + 1}</td>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${RS + formatRupee(unitPrice)}</td>
            <td class="align-right">${RS + formatRupee(totalPrice)}</td>
          </tr>
          `;
        })}
			</tbody>

			<tfoot>
			${generateEmptyTableRow('Discount', `${RS + discount}`)}
			${generateEmptyTableRow('Shipping', `${RS + shipping}`)}
				
		${taxLines.map((item, i) => {
      return generateEmptyTableRow(
        item.label,
        `${RS + formatRupee(parseFloat(item.tax_total).toFixed(2))}`,
      );
    })}
				
			${generateTotalTableRow('Total', `${RS + total}`)}
			</tfoot>

		</table>

	</div>
</body>

</html>
`;
}

function generateEmptyTableRow(label: string, value: string) {
  return `
	<tr>
		<td class="empty-td"></td>
		<td class="empty-td"></td>
		<td class="empty-td"></td>
		<td>
			${label}
		</td>
		<td class="align-right">
          ${value}
		</td>
	</tr>
	`;
}
function generateTotalTableRow(label: string, value: string) {
  return `
	<tr>
		<td class="empty-td"></td>
		<td class="empty-td"></td>
		<td class="empty-td"></td>
		<td class="last-td">
			${label}
		</td>
		<td class="last-td align-right">
		  <h4>
            ${value}
		  </h4>
		</td>
	</tr>
	`;
}

export function generateRazorpayDescription(
  items: { name: string; quantity: number }[],
) {
  const desc = items
    .map(item => `Name: ${item.name} Qty: ${item.quantity}`)
    .join('\n');
  return (
    'Order for: ' + (desc.length > 240 ? desc.slice(0, 240) + '...' : desc)
  );
}

export function generateRazorpayOptions({
  orderId,
  amount,
  items,
  billing,
}: {
  orderId: string;
  amount: number; // in paise
  items: { name: string; quantity: number }[];
  billing: BillingAddress;
}): CheckoutOptions {
  const liveKey = `rzp_live_e8IvfJgaiE3oJV`;
  //   const testKey = `rzp_test_wh8JDwR2Ene1la`;
  const description = generateRazorpayDescription(items);

  return {
    key: liveKey,
    name: 'Lelekart',
    description,
    currency: 'INR',
    order_id: orderId,
    amount,
    prefill: {
      name: billing.first_name,
      email: billing.email,
      contact: billing.phone,
    },
    theme: {
      color: lightTheme.colors.primary9,
    },
  };
}
