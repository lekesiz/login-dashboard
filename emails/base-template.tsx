import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Link,
} from '@react-email/components'

interface BaseEmailTemplateProps {
  preview: string
  heading: string
  children: React.ReactNode
}

export function BaseEmailTemplate({ preview, heading, children }: BaseEmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>Modern WebApp</Heading>
          </Section>
          
          <Section style={content}>
            <Heading as="h2" style={h2}>{heading}</Heading>
            {children}
          </Section>
          
          <Hr style={hr} />
          
          <Section style={footer}>
            <Text style={footerText}>
              Bu email size Modern WebApp tarafından gönderilmiştir.
            </Text>
            <Text style={footerText}>
              Eğer bu emaili beklemiyorsanız, güvenle silebilirsiniz.
            </Text>
            <Link href="https://example.com" style={footerLink}>
              modern-webapp.com
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  borderRadius: '8px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
}

const header = {
  padding: '24px 48px',
  backgroundColor: '#2563eb',
  borderRadius: '8px 8px 0 0',
}

const h1 = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '40px',
  margin: '0',
}

const content = {
  padding: '48px',
}

const h2 = {
  color: '#1f2937',
  fontSize: '20px',
  fontWeight: '600',
  lineHeight: '32px',
  margin: '0 0 24px',
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '0',
}

const footer = {
  padding: '32px 48px',
  textAlign: 'center' as const,
}

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 8px',
}

const footerLink = {
  color: '#2563eb',
  fontSize: '14px',
  textDecoration: 'none',
}