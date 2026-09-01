import React from 'react';
import { CalendarDays, CheckCheck, Users, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Avatar,
  Meter,
  PageHeader,
  Panel,
  Pill,
  StatCard,
  StatGrid,
  Td,
  Th,
  TableWrap,
  statusTone,
} from '@/components/demo/ttag/primitives.jsx';
import {
  CPF_EMPLOYER_RATE,
  attendanceToday,
  formatDate,
  formatSGD,
  leaveRequests,
  payrollRun,
  staff,
  staffById,
  technicianProductivity,
} from '@/data/ttagMotor';

export default function HumanResources() {
  const onShift = attendanceToday.filter((a) => a.status === 'On shift' || a.status === 'Late');
  const pendingLeave = leaveRequests.filter((l) => l.status === 'Pending');

  const grossPayroll = payrollRun.lines.reduce((s, l) => s + l.gross, 0);
  const employerCpf = payrollRun.lines.reduce((s, l) => s + l.cpfEmployer, 0);
  const netPayroll = payrollRun.lines.reduce((s, l) => s + l.net, 0);
  const totalCost = grossPayroll + employerCpf;

  const avgUtilisation =
    technicianProductivity.reduce((s, t) => s + t.billable / t.available, 0) /
    technicianProductivity.length;

  return (
    <>
      <PageHeader
        title="Human resources"
        description="Roster, attendance, technician productivity and the monthly payroll run"
        actions={
          <Button>
            <CheckCheck className="mr-2 h-4 w-4" />
            Approve payroll
          </Button>
        }
      />

      <StatGrid className="mb-4">
        <StatCard index={0} label="Headcount" value={staff.length} delta="2 departments on site" deltaTone="neutral" icon={Users} />
        <StatCard
          index={1}
          label="On shift today"
          value={`${onShift.length}/${staff.length}`}
          delta={`${attendanceToday.filter((a) => a.status === 'Late').length} late`}
          deltaTone={attendanceToday.some((a) => a.status === 'Late') ? 'warning' : 'success'}
          icon={CheckCheck}
        />
        <StatCard
          index={2}
          label={`Payroll cost — ${payrollRun.period}`}
          value={formatSGD(totalCost, { decimals: 0 })}
          delta={`Incl. ${(CPF_EMPLOYER_RATE * 100).toFixed(0)}% employer CPF`}
          deltaTone="info"
          icon={Wallet}
        />
        <StatCard
          index={3}
          label="Pending leave"
          value={pendingLeave.length}
          delta={pendingLeave.length ? 'Awaiting approval' : 'All cleared'}
          deltaTone={pendingLeave.length ? 'warning' : 'success'}
          icon={CalendarDays}
        />
      </StatGrid>

      <div className="mb-4 grid gap-4 xl:grid-cols-2">
        <Panel title="Attendance today" subtitle="Clock-ins from the workshop terminal" padded={false}>
          <TableWrap>
            <table className="w-full">
              <thead className="border-b border-border bg-muted/40">
                <tr>
                  <Th>Employee</Th>
                  <Th>Role</Th>
                  <Th>Clock in</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {attendanceToday.map((row) => {
                  const person = staffById(row.staffId);
                  return (
                    <tr key={row.staffId} className="transition-colors hover:bg-muted/40">
                      <Td>
                        <span className="flex items-center gap-2.5">
                          <Avatar initials={person.initials} />
                          <span className="font-medium">{person.name}</span>
                        </span>
                      </Td>
                      <Td className="text-muted-foreground">{person.role}</Td>
                      <Td className="tabular-nums text-muted-foreground">{row.clockIn ?? '—'}</Td>
                      <Td>
                        <Pill tone={statusTone(row.status)}>{row.status}</Pill>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableWrap>
        </Panel>

        <Panel
          title="Technician productivity"
          subtitle={`Billable against available hours · ${(avgUtilisation * 100).toFixed(0)}% average utilisation`}
        >
          <ul className="space-y-4">
            {technicianProductivity.map((t) => {
              const person = staffById(t.staffId);
              const utilisation = (t.billable / t.available) * 100;
              return (
                <li key={t.staffId}>
                  <div className="mb-1.5 flex items-center gap-2.5">
                    <Avatar initials={person.initials} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{person.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.billable} of {t.available} hrs billable · {t.jobsClosed} jobs closed
                      </p>
                    </div>
                    <Pill tone={t.reworkRate > 4 ? 'warning' : 'success'}>
                      {t.reworkRate}% rework
                    </Pill>
                  </div>
                  <Meter
                    value={utilisation}
                    tone={utilisation >= 80 ? 'success' : utilisation >= 65 ? 'info' : 'warning'}
                    label={`${person.name} utilisation`}
                  />
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>

      <Panel
        className="mb-4"
        title={`Payroll run — ${payrollRun.period}`}
        subtitle={`Pay date ${formatDate(payrollRun.payDate)}`}
        padded={false}
        actions={<Pill tone={statusTone(payrollRun.status)}>{payrollRun.status}</Pill>}
      >
        <TableWrap>
          <table className="w-full">
            <thead className="border-b border-border bg-muted/40">
              <tr>
                <Th>Employee</Th>
                <Th align="right">Base</Th>
                <Th align="right">Overtime</Th>
                <Th align="right">Allowance</Th>
                <Th align="right">Gross</Th>
                <Th align="right">CPF (employee)</Th>
                <Th align="right">CPF (employer)</Th>
                <Th align="right">Net pay</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {payrollRun.lines.map((line) => {
                const person = staffById(line.staffId);
                return (
                  <tr key={line.staffId} className="transition-colors hover:bg-muted/40">
                    <Td>
                      <span className="font-medium">{person.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">{person.role}</span>
                    </Td>
                    <Td align="right">{formatSGD(line.base, { decimals: 0 })}</Td>
                    <Td align="right">{formatSGD(line.overtime, { decimals: 0 })}</Td>
                    <Td align="right">{formatSGD(line.allowance, { decimals: 0 })}</Td>
                    <Td align="right" className="font-medium">
                      {formatSGD(line.gross, { decimals: 0 })}
                    </Td>
                    <Td align="right" className="text-muted-foreground">
                      {formatSGD(line.cpfEmployee, { decimals: 0 })}
                    </Td>
                    <Td align="right" className="text-muted-foreground">
                      {formatSGD(line.cpfEmployer, { decimals: 0 })}
                    </Td>
                    <Td align="right" className="font-semibold">
                      {formatSGD(line.net, { decimals: 0 })}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="border-t border-border bg-muted/30">
              <tr>
                <Td className="font-semibold">Total</Td>
                <Td colSpan={3} />
                <Td align="right" className="font-semibold">
                  {formatSGD(grossPayroll, { decimals: 0 })}
                </Td>
                <Td />
                <Td align="right" className="font-semibold">
                  {formatSGD(employerCpf, { decimals: 0 })}
                </Td>
                <Td align="right" className="font-semibold">
                  {formatSGD(netPayroll, { decimals: 0 })}
                </Td>
              </tr>
            </tfoot>
          </table>
        </TableWrap>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Leave requests" subtitle={`${pendingLeave.length} awaiting approval`} padded={false}>
          <TableWrap>
            <table className="w-full">
              <thead className="border-b border-border bg-muted/40">
                <tr>
                  <Th>Employee</Th>
                  <Th>Type</Th>
                  <Th>Dates</Th>
                  <Th align="right">Days</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {leaveRequests.map((leave) => (
                  <tr key={leave.id} className="transition-colors hover:bg-muted/40">
                    <Td className="font-medium">{staffById(leave.staffId)?.name}</Td>
                    <Td className="text-muted-foreground">{leave.type}</Td>
                    <Td className="text-muted-foreground">
                      {leave.from === leave.to
                        ? formatDate(leave.from)
                        : `${formatDate(leave.from)} – ${formatDate(leave.to)}`}
                    </Td>
                    <Td align="right">{leave.days}</Td>
                    <Td>
                      <Pill tone={statusTone(leave.status)}>{leave.status}</Pill>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        </Panel>

        <Panel title="Team directory" subtitle={`${staff.length} employees`} padded={false}>
          <ul className="divide-y divide-border">
            {staff.map((person) => (
              <li key={person.id} className="flex items-center gap-3 px-4 py-3">
                <Avatar initials={person.initials} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{person.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {person.role} · joined {formatDate(person.joined)}
                  </p>
                  {person.certifications.length > 0 && (
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {person.certifications.join(' · ')}
                    </p>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <Pill tone="neutral">{person.employment}</Pill>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {person.leaveBalance} days leave
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
