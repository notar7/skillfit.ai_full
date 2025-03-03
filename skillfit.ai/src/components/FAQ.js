import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function FAQ() {
  const [expanded, setExpanded] = React.useState([]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(
      isExpanded ? [...expanded, panel] : expanded.filter((item) => item !== panel),
    );
  };

  return (
    <Container
      id="faq"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Typography
        component="h2"
        variant="h4"
        sx={{
          color: 'text.primary',
          width: { sm: '100%', md: '60%' },
          textAlign: { sm: 'left', md: 'center' },
        }}
      >
        Frequently Asked Questions
      </Typography>
      <Box sx={{ width: '100%' }}>
        {/* Question 1 */}
        <Accordion
          expanded={expanded.includes('panel1')}
          onChange={handleChange('panel1')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1d-content"
            id="panel1d-header"
          >
            <Typography component="h3" variant="subtitle2">
              How does SkillFit.AI analyze my resume for ATS compatibility?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: '100%', md: '100%' } }}
            >
              SkillFit.AI uses advanced algorithms to scan your resume and ensure it aligns with Applicant Tracking Systems (ATS) requirements. It checks for formatting, keyword matching, and overall structure to enhance your chances of being shortlisted.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Question 2 */}
        <Accordion
          expanded={expanded.includes('panel2')}
          onChange={handleChange('panel2')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2d-content"
            id="panel2d-header"
          >
            <Typography component="h3" variant="subtitle2">
              What is the bias detection feature, and how does it work?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: '100%', md: '100%' } }}
            >
              The bias detection feature identifies potentially biased language in your resume, such as gendered terms or culturally sensitive phrasing. It provides suggestions for inclusive alternatives to help you create a more equitable resume.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Question 3 */}
        <Accordion
          expanded={expanded.includes('panel3')}
          onChange={handleChange('panel3')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3d-content"
            id="panel3d-header"
          >
            <Typography component="h3" variant="subtitle2">
              How are course recommendations personalized?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: '100%', md: '100%' } }}
            >
              Based on your resume analysis, SkillFit.AI identifies skill gaps and suggests targeted courses to bridge them. These recommendations are tailored to your career goals and the requirements of your desired job roles.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Question 4 */}
        <Accordion
          expanded={expanded.includes('panel4')}
          onChange={handleChange('panel4')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel4d-content"
            id="panel4d-header"
          >
            <Typography component="h3" variant="subtitle2">
              How can institutions use SkillFit.AI for their students?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: '100%', md: '100%' } }}
            >
              Institutions can access dashboards with aggregated, anonymous data to gain insights into student performance, skill gaps, and common resume issues. This helps them design targeted workshops and resources to enhance employability outcomes.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Question 5 */}
        <Accordion
          expanded={expanded.includes('panel5')}
          onChange={handleChange('panel5')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel5d-content"
            id="panel5d-header"
          >
            <Typography component="h3" variant="subtitle2">
              Is SkillFit.AI free to use for students?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: '100%', md: '100%' } }}
            >
              Yes, SkillFit.AI is completely free for students. We believe in making resume optimization and career guidance accessible to everyone, without any financial barriers.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Container>
  );
}

